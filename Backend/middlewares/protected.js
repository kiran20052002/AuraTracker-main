import jwt from "jsonwebtoken";

const isProtected = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Token not provided");
    }

    // Synchronous verification
    const decoded = jwt.verify(token, "appKey");
    
    // Attach user as object with _id property
    req.user = { _id: decoded.id }; 
    
    next();
  } catch (error) {
    next(new Error("Token expired, login again"));
  }
};

export default isProtected;
