import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";
import { Axios } from "axios";
// 유저 액션에 함수및 타입 정의
// 타입에도 정의
// user-reducer에 스위치문 내에 정의
export function loginUser(dataTosubmit) {
  const request = axios
    .post("/api/users/login", dataTosubmit)
    .then((response) => response.data);

  return {
    type: "LOGIN_USER",
    payload: request,
  };
}
export function registerUser(dataTosubmit) {
  const request = axios
    .post("/api/users/register", dataTosubmit)
    .then((response) => response.data);

  return {
    type: "REGISTER_USER",
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return {
    type: "AUTH_USER",
    payload: request,
  };
}
