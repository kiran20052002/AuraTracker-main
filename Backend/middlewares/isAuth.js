import jwt from "jsonwebtoken";

const isAuthenticated = async(req,res,next)=>{
    const headerObj=req.headers;
    const token=headerObj?.authorization?.split(" ")[1];
    // console.log(token);
    //verify token
    const verifyToken =jwt.verify(token,"appKey",(err,decoded)=>{
        console.log(decoded);
        if(err){
            return false;
        }
        else{
            return decoded;
        }
    });
    if(verifyToken){
        //save the user req obj
        req.user=verifyToken.id;
        next();
    }else{
        const err=new Error("Token expired,login again");
        next(err);
    }
};

export default isAuthenticated;