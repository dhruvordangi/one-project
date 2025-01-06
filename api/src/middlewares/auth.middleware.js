import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const secret = "jn4k5n6n5nnn6oi4n";
export const isAuthenticated = async (req, res, next) => {
    try {
        
      const token = req.cookies.token;  // Change from headers to cookies
  
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }
  
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id);
  
      if (!req.user) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Authentication required" });
    }
  };
  