import JWT from "jsonwebtoken";

export const verifyAuthentication = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing." });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid authentication token.", error: error.message });
  }
};
