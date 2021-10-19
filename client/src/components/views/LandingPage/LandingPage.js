import React, { useEffect } from "react";
import axios from "axios";
function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
    // client(3000)와 server(5000)의 도메인이 다르므로 바로 연결이 불가능
    // CROS 이슈, 다른 도메인에 쉽게 접속이 되면 client에 원하는 내용을 보낼수없음
    // PROXY를 사용
  }, []);

  return <div>LandingPage</div>;
}

export default LandingPage;
