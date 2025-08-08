import { Router } from "express";
import { addNewMessages, checkMembership, deleteMessage, getAdmin, getAllMessages } from "../db/queries.js";
import { checkAuth } from "../middlewares.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)
const MessRouter = Router()
MessRouter.use(checkAuth)

MessRouter.get('/',async (req, res) => {
    const adminId = req.user.id;
    const result = await getAdmin(adminId)
    const {rows} = await getAllMessages()

    const {membership} = await checkMembership(adminId)
    console.log(result.rows[0]);
    
    if(result.rows[0].admin === true) {
        res.render('./messages/messages', {data: rows, dayjs: dayjs, admin: true, isMember: membership})
    } else {
        res.render( './messages/messages', {data: rows, dayjs: dayjs, admin: false, isMember: membership})
    }
    
})

MessRouter.get('/create', async (req, res) => {
    res.render('./messages/createMessage')
})

MessRouter.post('/create', async (req, res) => {
    const { message} = req.body;
    const userid = req.user.id;
    await addNewMessages(message, userid)
    res.redirect('/messages')
})


MessRouter.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await deleteMessage(id)
    res.redirect('/messages')
})

export default MessRouter