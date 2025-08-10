import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../db/pool.js";
import passport from "passport";
import { validationResult } from "express-validator";
import { addNewUsers, checkMembership, getUserByUsername, updateMembership } from "../db/queries.js";
import { loginValidator, sigupValidator } from "../utils/validator.js";
import { checkAuth } from "../middlewares.js";

const authRouter = Router()

authRouter.get('/login', (req, res) => {
    res.render('./auth/login', { errors: []})
})

authRouter.post('/login',
    loginValidator,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).render('./auth/login', {
                errors: errors.array(),
                user: req.body.username
            });
        }
        next();
    },
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).render('./auth/login', {
                    errors: [{ msg: 'Invalid username or password' }],
                    user: req.body.username
                });
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                req.session.data = {
                    username: user.username,
                    user_id: user.user_id
                };

                return res.redirect('/messages');
            });
        })(req, res, next);
    }
);

authRouter.get('/signup', (req, res) => {
    res.render('./auth/signup', {errors: []})
})

authRouter.post('/signup',
    sigupValidator,
    async (req, res, next) => {
           const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).render('./auth/signup', {
                errors: errors.array(),
                user: req.body.username
            });
        }
    
    const {firstname, lastname, username} = req.body
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await addNewUsers(firstname, lastname, username, hashedPassword)
        res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authRouter.get('/logout', (req, res, next) => {
    req.session.destroy()
      
    res.redirect('/auth/login')
})

authRouter.get('/join', checkAuth, (req, res) => {
    const user = req.user;
    res.render('./auth/members', {msg: '', isMember: false, user: user})
})

authRouter.post('/join', async (req, res) => {
    const { passkey } = req.body;
    const id = req.user.id;
    const user = req.user;
    const {membership} = await checkMembership(id);
        
    if (passkey === 'join' && membership === null) {
        await updateMembership(id)
        
        res.redirect('/messages')

    } else if( membership == true && passkey == 'join')  {
        res.render('./auth/members', {msg: 'members can\'t rejoin, you are already a member', user: user, isMember: membership})
    } else if (passkey !== 'join') {
        res.render('./auth/members', {msg: 'Incorrect passkey, please try again', user: user, isMember: membership})
    }
    

 })
export default authRouter;