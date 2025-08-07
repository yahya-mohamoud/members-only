import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import authRouter from './routes/auth.js'
import connectPgSimple from 'connect-pg-simple'
import pool from './db/pool.js'
import passport from 'passport'
import passportConfig from './utils/passport.config.js'
import MessRouter from './routes/messages.js'
import { getAllMessages } from './db/queries.js'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'
import path from 'path'
import { fileURLToPath } from 'url'
dayjs.extend(relativeTime)

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pgSession = connectPgSimple(session)
app.use( express.static(path.join(__dirname, 'public')))
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

app.get('/',  async (req, res) => {
    const { rows } = await getAllMessages()
    res.render('index', { messages: rows, dayjs: dayjs})
    
}) 

app.use('/auth', authRouter)
app.use('/messages', MessRouter)

const PORT = process.env.PORT;
app.listen(3000, () => console.log(`server started on PORT: 3000`))

