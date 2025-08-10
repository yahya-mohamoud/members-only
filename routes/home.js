import { checkMembership, getAdmin, getAllMessages } from "../db/queries.js"
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)


export const home = async (req, res) => {
    const { rows } = await getAllMessages()
    
    if (!req.user) {
        return res.redirect('/auth/login')
    }

    const user = req.user;
    const id = req.user.id;
    const result = await getAdmin(id)                
    
    const {membership} = await checkMembership(id)
    const isAdmin = result.rows[0].isAdmin; 
    
    if(isAdmin) {
        res.render('index', { messages: rows, dayjs: dayjs, isMember: membership, admin: isAdmin, user: user})
    } else {
        res.render('index', { messages: rows, dayjs: dayjs, isMember: membership, admin: isAdmin, user: user})
    }

    
}