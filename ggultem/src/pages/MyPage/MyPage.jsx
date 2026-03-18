import React from "react";
import "./MyPage.css"; // CSS 파일 임포트
import MyPageMain from "../../components/MyPage/MyPageComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { useParams } from "react-router-dom";

const MyPage = () => {
  const { email } = useParams();

  return (
    <div className="mypage-page-wrapper">
      <Header />
      <main className="mypage-main-content">
        <MyPageMain email={email} />
      </main>
      <Footer />
    </div>
  );
};

export default MyPage;
