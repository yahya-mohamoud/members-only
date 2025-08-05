import { Router } from "express";
import { getAllMessages } from "../db/queries.js";
import { checkAuth } from "../middlewares.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)
const MessRouter = Router()
MessRouter.use(checkAuth)

MessRouter.get('/',async (req, res) => {
    
    const {rows} = await getAllMessages()
    res.render('messages', {data: rows, dayjs: dayjs})
})

// MessRouter

export default MessRouter