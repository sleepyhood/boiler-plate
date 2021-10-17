const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const cookeParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));

// 이거 하나떄문에 json이 제대로 안된것
app.use(bodyParser.json());
app.use(cookeParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    // useNewRelParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  // 회원가입시 필요한 정보들을 client에서가져옴,
  // 데이터 베이스에 넣어줌
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ sucess: false, err });
    return res.status(200).json({
      sucess: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 요청된 이메일이 데이터베이스에 존재하는지
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucess: false,
        message: "이메일에 해당되는 유저가 없습니다.",
      });
    }

    // 이미 있으면, 비번이 일치하는지 찾음
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSucess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      // 비번도 똑같으면 토큰생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 어디에 저장한다?  => 쿠키냐 로컬스토리지냐 그것이문제로다
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSucess: true, userID: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
