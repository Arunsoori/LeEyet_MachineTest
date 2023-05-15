const User = require("../Models/UserModel")
const jwt = require ("jsonwebtoken")


module.exports.checkUser = (req,res, next) =>{
    console.log("llllllllllllllllllllll");
    const token = req.cookies.jwt
    if (token){
        jwt.verify(token,"kishan sheth super key",async (err,decodedToken)=>{
            if(err){
                res.json({status:false})
        next()
            }else{
                const user= await User.findById(req.body.userID)
                console.log(user,"logged user");
                if (user) res.json({status : true, address : user.address,name:user.name, image:user.imageUrl})
            }
        })

    }else{
        res.json({status:false})
        next()

    }
}