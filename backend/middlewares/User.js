import { verify } from "jsonwebtoken";
import prisma from "../services/prisma";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        user_type: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ error: "User account is not active" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

export function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.user_type)) {
      return res.status(403).json({
        error: `Forbidden: User role "${user?.user_type}" not allowed`,
      });
    }

    next();
  };
}
