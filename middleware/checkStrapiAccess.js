import jwt from "jsonwebtoken";
import { prisma } from "../server.js";

const fullAccess = process.env.STRAPI_FULL_ACCESS_TOKEN;
const readOnly = process.env.STRAPI_READ_ONLY_TOKEN;

// Middleware to check if the user is admin or non-admin
export const checkStrapiAccess = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await prisma.user.findUnique({
      where: {
        user_id: decoded.userId,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    let strapiAccessToken;
    if (user.role === "admin") {
      strapiAccessToken = fullAccess;
    } else {
      strapiAccessToken = readOnly;
    }
    // Store the Strapi token in request object for later use
    req.strapiAccessToken = strapiAccessToken;

    if (
      strapiAccessToken === readOnly &&
      ["POST", "PUT", "DELETE"].includes(req.method)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
