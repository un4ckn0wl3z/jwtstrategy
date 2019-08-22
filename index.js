//index.js
/* import library ที่จำเป็นทั้งหมด */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const jwt = require("jwt-simple");
const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "MY_SECRET_KEY";
//สร้าง Strategy
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
   if (payload.sub === "anuwat") done(null, true);
   else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);
//ทำ Passport Middleware
const requireJWTAuth = passport.authenticate("jwt",{session:false});
//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
app.get("/", requireJWTAuth, (req, res) => {
   res.send("ยอดเงินคงเหลือ 50");
});
//ทำ Middleware สำหรับขอ JWT
const loginMiddleWare = (req, res, next) => {
   if (req.body.username === "anuwat" 
   && req.body.password === "12345") next();
   else res.send("Wrong username and password");
};
app.post("/login", loginMiddleWare, (req, res) => {
   const payload = {
      sub: req.body.username,
      iat: new Date().getTime()
   };
   res.send(jwt.encode(payload, SECRET));
});
app.listen(3000);