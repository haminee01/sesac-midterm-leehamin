import jwt from "jsonwebtoken";
const SECRET_KEY = "sessac";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
