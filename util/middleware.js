const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const tokenExtractor = (req, res, next) => {
  // middleware for extracting token from request
  const authorization = req.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET); // gives user object
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "SequelizeDatabaseError") {
    return response.status(500).json({ error: error.message });
  } else if (error.name === "TypeError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: "invalid username" });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};
