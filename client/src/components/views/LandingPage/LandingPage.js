import React, { useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
function LandingPage(props) {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
    // client(3000)와 server(5000)의 도메인이 다르므로 바로 연결이 불가능
    // CROS 이슈, 다른 도메인에 쉽게 접속이 되면 client에 원하는 내용을 보낼수없음
    // PROXY를 사용
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      // console.log(response.data);
      if (response.data.success) {
        props.history.push("/login");
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default withRouter(LandingPage);
