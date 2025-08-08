import pool from "./pool.js"

export const addNewUsers = async (firstname, lastname, username, password) => {
    return await pool.query('insert into users (firstname, lastname, username, password) values ($1, $2, $3, $4)', [firstname, lastname, username, password])
}


export const getUserById = async (id) => {
   return  await pool.query('select * from users where id = $1', [id])
}

export const getUserByUsername = async (username) => {
    return await pool.query('SELECT * FROM users WHERE username = $1', [username])
}

export const getAllMessages= async () => {
   return  await pool.query('select * from messages join users on messages.userid = users.id', )
}

export const addNewMessages = async (message, userId) =>{
    return await pool.query('insert into messages (message, userid) values ($1, $2)', [message, userId])
}

export const getAdmin = async (id) => {
    return await pool.query('select * from users where id = $1', [id])
}

export const deleteMessage = async (id) => {
    return await pool.query('delete from messages where mess_id = $1', [id])
}

export const updateMembership = async (id) => {
    return await pool.query('update users set membership = true where id = $1', [id])
}

export const checkMembership = async (id) => {
    const {rows} = await pool.query('select membership from users where id = $1', [id])
    return rows[0]
}