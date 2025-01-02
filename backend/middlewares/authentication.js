import jwt from "jsonwebtoken";

// Middleware para verificar el token y el estado de la cuenta
const authenticateToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Token not valid" });
    }

    req.userId = payload.id;
    req.isDeleted = payload.is_deleted;
    req.isAdmin = payload.is_admin; // Añadir verificación de admin

    // Verificar si la cuenta está eliminada
    if (req.isDeleted && req.path !== "/restore") {
      return res.status(403).json({ message: "Account is deleted" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
};

// Middleware para restringir acceso solo a administradores
const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ message: "Access restricted to admins only" });
  }
  next();
};

// Generar un token de verificación
const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export { authenticateToken, isAdmin, generateVerificationToken };
