import axios from "axios";
import "dotenv/config"
import bcrypt from "bcrypt";

async function user(req, res){
const username = req.body.username
const password = req.body.password

const users = await axios.get(process.env.JSON_SERVER_PATH + '/user').then(res => res.data).catch(err => console.error(err))

if (users && users.length){
    let getUser, getPassword
    users.some(user => {
        if(user.name === username){
            getUser = user.name
            getPassword = user.password
            return true
        }
    })
    console.log(getUser, getPassword)

    if(!getUser){
        res.status(200).send({info:"cannot find user", code: "1"})
    }else if(getPassword) {
        const match = await bcrypt.compare(password, getPassword)
        if(match){
            res.status(200).send({info: "success", code: "0"})
        } else{
            res.status(200).send({info: "password error", code: "2"})
        }
    }
}
}

export { user }