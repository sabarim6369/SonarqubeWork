const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const createToken = (payload, expiresIn = "30d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

 

    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }


    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });

    return res.status(200).json({ success: true, message: "Token is valid", decoded });

  } catch (error) {
    console.error("Error while checking token:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};



const checkToken = async (req, res, next) => {
  try {
    await verifyToken(req, res);
    next();
  } catch (error) {

    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { createToken, verifyToken, checkToken };
