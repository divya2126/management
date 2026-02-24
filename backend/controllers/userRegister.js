const RegisterModel = require("..//model/Register.model");
const { registerValidation } = require("../validations/userValidation");

//main function starts here we declare user register and create a arrow function
const userRegister = async(req, res , next)=>{

    //step1 to create api   where we send req to frontend and check if the user is valid
    const registerData = await registerValidation.validateAsync(req.body);
    console.log("registerData:",registerData);


    //step 2. data extract now here we are going to deconstruct the value 
    const {name, email, password, role } = registerData;

    //step :3 now check it in monogDB if the user already exists

    const registerDataCheck = await RegisterModel.findOne({
        email: email,
    })

    console.log("registerDataCheck:",registerDataCheck);
    if (registerDataCheck){
       return res.json({status:"username already exists"});
    }
     
    

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password , salt)
   
    //step 4 now store data in mongoDb
    const registerModel = new RegisterModel({
       name:name,
       email:email,
       password:hashpassword,
       role:role,
    });

await registerModel.save();

//step5 sends the responsse back to frontend

res.json({status:"Registration successful"});
}

module.exports = userRegister;