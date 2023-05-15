
const UserModel = require("../Models/UserModel")
const jwt = require("jsonwebtoken")


const maxAge = 3 * 24 * 60 * 60;



const createToken = (id) => {
    return jwt.sign({ id }, "kishan sheth super key", {
        expiresIn: maxAge
    })
}

const handleErrors = (err) => {
    let errors = { email: "", password: "" }
    // console.log(err.message,"eeeeeeeeeeeeee");


    if (err.message === "Email incorrect")
        errors.email = "Email is not registered"

    if (err.message === "Password incorrect")
        errors.password = "password is wrong"



    if (err.code === 11000) {
        errors.email = "Email is already registered"
        return errors;
    }
    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}


module.exports.register = async (req, res, next) => {

    try {
        console.log(req.body);
        let imageUrl = `images/${req.file.filename}`;
        const { name,address, password } = req.body;

        // console.log(email);
        // console.log(password);
        const user = await UserModel.create({ name,address, password,imageUrl })

        // const token = createToken(user._id)
        // // res.cookie("jwt", token, {
        // //     withCredentials: true,
        // //     httpOnly: false,
        // //     maxAge: maxAge * 1000,


        // // })
        res.status(201).json({ user: user._id, created: true })
    } catch (err) {
        // console.log(err);
        const errors = handleErrors(err)
        res.json({ errors, created: false })

    }

}
module.exports.login = async (req, res, next) => {
    console.log("dddddddddddddd");
    try {
       
        // console.log(req.body);
        const { name, password } = req.body;
        // console.log(email,"yiyi");
        // console.log(password ,"pipi");
        const user = await UserModel.login(name, password)

        const token = createToken(user._id)
        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,


        })
        res.status(200).json({ user: user._id, created: true ,image:user.imageUrl})
    } catch (err) {
        // console.log(err,"thisone");
        const errors = handleErrors(err)
        // console.log(errors.password,"jjjjjjjjj");
        res.json({ errors, created: false })

    }

}
module.exports.uploadImage = async (req,res,next)=>{
    console.log("iiiiiiiiiiiiiiiiiiiiiiii");
    const token = req.cookies.jwt
    jwt.verify(token ,"kishan sheth super key",async(err,decodedToken)=>{
        if(err){
            res.json({status:false})
            next()
        } else{
            console.log("in");
            const user= await UserModel.findById(decodedToken.id)
            if(user){
                user.imageUrl = `images/${req.file.filename}`;
                console.log(user,"upload");
                const updatedUser = await user.save();
 res.json({user,image:user.imageUrl, status:true})

            }else{
                res.json({status:false})
            }
        }
    })
}
module.exports.updateUser = async (req,res,next)=>{

    console.log("inupdate user function");

    try {
        const {id,name,address,imageUrl} = req.body
        console.log(req.body,"hiiiii")
        const userdata = await UserModel.findOneAndUpdate({_id:id},{$set:{
            name:name,
            address:address,
            imageUrl:imageUrl
        }}).then(()=>{
            res.status(201).json({status:true,message:"User data edited"})
        })
    } catch (error) {
        console.log(error);
    }

 }