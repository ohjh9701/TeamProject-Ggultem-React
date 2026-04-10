import axios from "axios";
import { getCookie, setCookie } from "../util/cookieUtil";
import { API_SERVER_HOST } from "../api/config";

const jwtAxios = axios.create();
//before request  요청 보내기 전에 추가작업(쿠키의 정보를 가져와서 Acess Token 전달)
const beforeReq = (config) => {
  console.log("before request ........................................ ");
  const memberInfo = getCookie("member");
  if (!memberInfo) {
    console.log("Member NOT FOUND");
    return Promise.reject({
      response: {
        data: { error: "REQUIRE_LOGIN" },
      },
    });
  } //end of if
  //member 정보가 있으면 전송하는 headers.Authorization에  accessToken을 포함시킨다.
  const { accessToken } = memberInfo;
  // Authorization 헤더 처리
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;
  const header = { headers: { Authorization: `Bearer ${accessToken}` } };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header,
  );
  console.log(" ---------------------------------------- ");
  console.log(res.data);
  return res.data;
};

//fail request  요청 보내기 하다가 실패했을 때 추가 작업(추가적인 요청을 멈추라는 명령)
const requestFail = (err) => {
  console.log("request error. ........................................ ");
  return Promise.reject(err);
};
// //before return response 성공적인 응답이 왔을 때 추가 작업
// const beforeRes = async (res) => {
//   console.log(
//     "before return response .......................................... ",
//   );
//   return res;
// };

//before return response 성공적인 응답이 왔을 때 추가 작업
const beforeRes = async (res) => {
  console.log(
    "before return response............................................... ",
  );
  console.log(res);
  const data = res.data;

  //accessToken 에러
  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberCookieValue = getCookie("member");
    const result = await refreshJWT(
      memberCookieValue.accessToken,
      memberCookieValue.refreshToken,
    );
    console.log("refreshJWT RESULT", result);
    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;
    setCookie("member", JSON.stringify(memberCookieValue), 1);
  }
  return res;
};

//fail response 성공적인 응답이 실패했을때 추가작업
const responseFail = (err) => {
  console.log(
    "response fail error. ............................................... ",
  );
  return Promise.reject(err);
};

//jwtAxios 인터셉터(interceptors) 걸어서 반환을 한다.
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);
export default jwtAxios;