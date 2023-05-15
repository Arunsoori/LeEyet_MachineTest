const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "kishan sheth super key", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  // console.log(err.message,"eeeeeeeeeeeeee");

  if (err.message === "Email incorrect")
    errors.email = "Email is not registered";

  if (err.message === "Password incorrect")
    errors.password = "password is wrong";

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    let imageUrl = `images/${req.file.filename}`;
    const { name, address, password } = req.body;

  
    const user = await UserModel.create({ name, address, password, imageUrl });

  
    res.status(201).json({ user: user._id, created: true });
  } catch (err) {

    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};
module.exports.login = async (req, res, next) => {
  console.log("dddddddddddddd");
  try {
    
    const { name, password } = req.body;
   
    const user = await UserModel.login(name, password);

    
    res
      .status(200)
      .json({ user: user._id, created: true, image: user.imageUrl });
  } catch (err) {
  
    const errors = handleErrors(err);
   
    res.json({ errors, created: false });
  }
};
module.exports.uploadImage = async (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, "kishan sheth super key", async (err, decodedToken) => {
    if (err) {
      res.json({ status: false });
      next();
    } else {
      console.log("in");
      const user = await UserModel.findById(decodedToken.id);
      if (user) {
        user.imageUrl = `images/${req.file.filename}`;
        console.log(user, "upload");
        const updatedUser = await user.save();
        res.json({ user, image: user.imageUrl, status: true });
      } else {
        res.json({ status: false });
      }
    }
  });
};
module.exports.updateUser = async (req, res, next) => {
    try {
        const { id, name, address } = req.body;
        const update = { name, address };
      
        if (req.file) {
          const fileName = req.file.filename;
          const imageUrl = `images/${fileName}`;
          update.imageUrl = imageUrl;
        }
      
        console.log(req.body, "hiiiii");
        console.log(update.imageUrl, "hiiiii");
      
        await UserModel.findOneAndUpdate({ _id: id }, { $set: update });
      
        res.status(201).json({ status: true, message: "User data edited" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to edit user data" });
      }
      
};
