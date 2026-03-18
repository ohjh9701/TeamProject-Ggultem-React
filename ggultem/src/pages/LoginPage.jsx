import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { loginPost } from "../api/MemberApi";
import { setCookie } from "../util/cookieUtil";
import Header from "../include/Header";
import Footer from "../include/Footer";
import { getKakaoLoginLink } from "../api/MemberApi";

const Login = () => {
  const [loginParam, setLoginParam] = useState({ email: "", pw: "" });
  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setLoginParam({ ...loginParam, [e.target.name]: e.target.value });
  };

  const handleKakaoLogin = () => {
    // 카카오 인증 페이지로 이동
    window.location.href = getKakaoLoginLink();
  };

  const handleClickLogin = (e) => {
    e.preventDefault();

    loginPost(loginParam)
      .then((data) => {
        console.log("로그인 성공 데이터:", data);

        if (data.error) {
          alert("이메일 또는 비밀번호를 확인해주세요.");
        } else {
          // 1. 서버에서 받은 정보(이메일, 닉네임, 토큰 등)를 쿠키에 저장
          setCookie("member", JSON.stringify(data), 1); // 1일 유지
          alert(`${data.nickname}님, 꿀템에 오신 걸 환영해요! 🍯`);
          navigate("/");
        }
      })
      .catch((err) => {
        alert("로그인 중 오류가 발생했습니다. 서버 상태를 확인해 주세요.");
      });
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-box">
        <div className="login-logo">🍯 꿀템</div>
        <h2 className="login-title">로그인</h2>
        <p className="login-subtitle">오늘도 달콤한 득템을 시작해볼까요?</p>

        <form className="login-form">
          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@honey.com"
              value={loginParam.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="pw"
              placeholder="비밀번호를 입력하세요"
              value={loginParam.pw}
              onChange={handleChange}
            />
          </div>

          <button className="login-btn" onClick={handleClickLogin}>
            꿀템 로그인
          </button>
        </form>

        <div className="social-login-container">
          <p className="social-text">간편하게 시작하기</p>
          <div className="social-buttons">
            <button onClick={handleKakaoLogin} className="social-btn kakao">
              <span className="social-icon">💬</span> 카카오 로그인
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
