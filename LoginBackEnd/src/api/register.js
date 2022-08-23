import axios from "axios";
import "dotenv/config"
import bcrypt from "bcrypt";

async function register(req, res){
console.log(req.body);
const users = await axios.get(process.env.JSON_SERVER_PATH + '/user')
.then(res => res.data)
.catch(err => console.error(err))



if(users && users.length){
    let status = false
    users.some(user => {
        if(user.name && user.name === req.body.username){
            res.status(200).send({
                "info": "already have some username",
                "code": "1",
                "username": req.body.username
            })
            status = true
            return true
        }
    })
       
       if(status){
        return
       }

    }
    
       if(!req.body.password){
        res.status(200).send({
            "info": "password incorrect",
            "code": "2",
            "password": req.body.password
        })
       }else{

            const getBcrypt = await axios.get(process.env.JSON_SERVER_PATH + '/bcrypt/1')
            const saltRounds = getBcrypt.data.saltRounds
            const password = await bcrypt.hash(req.body.password, saltRounds)
            console.log(req.body.password, password)
       
            await axios.post(process.env.JSON_SERVER_PATH + "/user", {
                name: req.body.username,
                password
            })

            
            res.status(200).send({
            "info": "Hello World",
            "code": "0"
        })

       }
       


}

export { register } 