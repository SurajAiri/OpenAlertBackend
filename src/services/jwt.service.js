import jwt from "jsonwebtoken";

const jwtService = {
  generateJWT(user) {
    if (!user || !user._id || !user.email) {
      throw new Error("Invalid user object");
    }
    const payload = {
      id: user._id,
      userType: "user",
    };
    // console.log("Generating JWT with payload:", process.env.JWT_EXPIRATION);
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  },
  verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },
};

export default jwtService;
