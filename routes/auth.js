import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../db/pool.js";
import passport from "passport";
import validateUser from "../utils/validator.js";
import { validationResult } from "express-validator";
import { addNewUsers, getUserByUsername } from "../db/queries.js";

const authRouter = Router()

authRouter.get('/login', (req, res) => {
    res.render('login', { errors: []})
})

authRouter.post('/login',
    validateUser,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).render('login', {
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
                return res.status(401).render('login', {
                    errors: [{ msg: 'Invalid username or password' }],
                    user: req.body.username
                });
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                // ✅ Set your custom session data here
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
    res.render('signup')
})

authRouter.post('/signup', async (req, res, next) => {
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
export default authRouter;