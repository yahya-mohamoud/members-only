import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import authRouter from './routes/auth.js'
import connectPgSimple from 'connect-pg-simple'
import pool from './db/pool.js'
import passport from 'passport'
import passportConfig from './utils/passport.config.js'
import MessRouter from './routes/messages.js'
import { ensureAuthenticated } from './middlewares.js'
dotenv.config()

const app = express()

const pgSession = connectPgSimple(session)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
     maxAge: 1000 * 60 * 60,
    }        
}))
passportConfig(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', ensureAuthenticated, (req, res) => res.render('index'))
app.use('/auth', authRouter)
app.use('/messages', MessRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server started on PORT: ${PORT}`))

