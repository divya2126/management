const mongoose = require('mongoose');

const AttendenceSchema = new mongoose.Schema(
    {
       ClassID :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required:true,
           },
           date:{
            type :Date,
            required:true,
           },

              students:[{
                studentId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                    required:true,
                },
                status:{
                    type:String,
                    enum: ["Present", "Absent"],
                    default: "Absent",
        
             }
    }]
    }
)