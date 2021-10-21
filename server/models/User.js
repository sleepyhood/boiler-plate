const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 공백제거
    unique: 1, // 중복값 없이
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  // 비번만 바꾸거나 만들때만 해시함수 적용
  if (user.isModified("password")) {
    // 비번 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword는 원본 비번, 암호화된 비번과의 대조가 필요
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken으로 token 생성
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  //   user._id + 'secretToken' = token
  // => 'secretToken' -> user._id

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // user._id+ '' = Token
  // 토큰을 복호화 작업
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저아이디로 유저를 찾고
    //  클라이언트에서 가져온 token과 DB에 저장된 토큰이 일치하는가
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return console(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
