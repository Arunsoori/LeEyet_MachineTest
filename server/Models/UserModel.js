const mongoose = require ("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({

password:{
    type:String,
    required :[true,"Password is required"],


},
address:{
    type:String,
    required :[true,"Address is required"],


},
name:{
    type:String,
    required :[true,"name is required"],
    unique:true,


},
imageUrl:{
    type:String
},
})

userSchema.pre("save", async function(next){
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password, salt)
    next()
})


userSchema.statics.login = async function (name,password) {
    // console.log(email,"lllllllllll");
    const user = await this.findOne({name})
    // console.log(user,"uuuuuuuuu");
    if(user) {
        
        const auth = await bcrypt.compare(password,user.password)
        
    
    if (auth){
        return user;
    }
     throw Error("Password incorrect")
}
throw Error("Email incorrect")

}

module.exports = mongoose.model("Users", userSchema)