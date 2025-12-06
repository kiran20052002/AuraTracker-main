import mongoose from 'mongoose';

const attendanceSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    subject:{
        type:String,
        required:[true,'Subject name is required'],
    },
    credit:{
        type:Number,
        required:true,
        min:1,
    },
    totalClasses:{
        type:Number,
        required:true,
    },
    attendedClasses:{
        type:Number,
        required:true,
    }
},{timestamps:true,});

export default mongoose.model('Attendance',attendanceSchema);