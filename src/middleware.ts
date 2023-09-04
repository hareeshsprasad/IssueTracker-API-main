
import { expressjwt } from "express-jwt";
import express from "express";
const app = express();
import * as fs from "fs";
import * as path from "path";
const RSA_PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "./../keys/jwt_public.key")
);
export const isAuthenticated = app.use(function (
  req: any,
  res: any,
  next: any
) {
  const handleErrorNext = (err: any) => {
    if (err) {
      if (err.inner.name === "TokenExpiredError") {
        return res.send({
          message: "Token is Expired",
          success: false,
          error: err.inner.name,
          redirect: true,
        });
      } else if (err.name === "UnauthorizedError") {
        return res.send({
          message: "Token is not valid",
          success: false,
          error: err.name,
          redirect: true,
        });
      } else {
        return res.send({
          message: err.name,
          success: false,
          error: err.message,
          redirect: false,
        });
      }
    } else{
      next();
    }
    
  };
  const middleware = expressjwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: ["RS256"],
    requestProperty: 'payload',
    getToken: function fromHeaderOrQuerystring(req: any) {
      try {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      } catch (error: any) {
        return res.send({ message: error.message, success: false });
      }
    },
  });
  middleware(req, res, handleErrorNext);
});