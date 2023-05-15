const {register , login, uploadImage, updateUser } = require ("../Controllers/AuthControllers")
const { checkUser } = require("../Middlewares/Authmiddleware")
const {uploadFile} = require ('../Middlewares/multer')

const router = require("express").Router()

router.post("/",checkUser)
router.post("/register",uploadFile.single('image'),register)
router.post("/login",login)
router.post("/uploadimage",uploadFile.single('image'),uploadImage)
router.post("/update",updateUser)


module.exports = router;
