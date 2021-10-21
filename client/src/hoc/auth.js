import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
export default function (SpecificComponent, option, adminRoute = null) {
  // option null  => 아무나 출입 가능
  // option true  => 로그인한 사람만 출입 가능
  // option false => 로그인한 사람 출입 불가능

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        //로그인 안했을때
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          // 로그인 했을때
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) props.history.push("/");
          }
        }
      });
      Axios.get("/api/users/auth");
    }, []);

    return <SpecificComponent {...props} />;
  }
  return AuthenticationCheck;
}
