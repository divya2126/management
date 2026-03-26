const moongoose = require('moongoose')

const teacherSchema = new moongoose.Schema({
    name :{
        type:String,
        required:true,
    },

    department:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true
    }
})

const TeacherModel = moongoose.model('TeacherModel',teacherSchema)