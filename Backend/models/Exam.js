import mongoose from 'mongoose';

const examSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    subject:{
        type:String,
        required:[true,'Subject name is required'],
    },
    date:{
        type:Date,
        required:true,
    },
    roomNo:{
        type:String,
        required:true,
    }
},{timestamps:true,});

export default mongoose.model('Exam',examSchema);