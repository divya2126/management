const {mongoose, schema} = require("mongoose");

const RegisterModel =new schema ({
    name: {
        type :String,
        required: true,
    } ,
    
    role:{
        type:String,
        required: true,
    },
    
    email: {
        type:String ,
        required:true,
    },
     
    
    password: {
        type : String,
        required : true,
    }

})

module.exports = mongoose.model("RegsiterModel",RegisterModel);