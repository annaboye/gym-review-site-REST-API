const { UnauthenticatedError, UnauthorizedError } = require("../utils/errors");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      // @ts-ignore
      userId: payload.userId,
      // @ts-ignore
      role: payload.role,
      // @ts-ignore
      username: payload.username,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

// NOTE: Should always be placed AFTER isAuthenticated middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    next();
  };
};
