const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리
  // 클라이언트 쿠키에서 토큰 가져옴
  let token = req.cookies.x_auth;
  // 토큰을 복호화후 유저 탐색
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
  // 유저가 있으면 인증 OK
  // 유저가 없으면 인증 No
};

module.exports = { auth };
