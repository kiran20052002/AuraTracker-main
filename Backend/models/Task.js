import mongoose from 'mongoose';

const taskSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true,
        default:"Uncategorized",
    },
    type:{
        type:String,
        required:true,
        default:"Not completed",
    }
},{timestamps:true,});

export default mongoose.model('Task',taskSchema);