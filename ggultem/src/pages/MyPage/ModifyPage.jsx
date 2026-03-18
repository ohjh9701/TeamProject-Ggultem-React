import React from "react";
import "./MyPage.css"; // CSS 파일 임포트
import ModifyComponent from "../../components/MyPage/ModifyComponent";
import Header from "../../include/Header";
import Footer from "../../include/Footer";
import { useParams } from "react-router-dom";

const ModifyPage = () => {
  const { email } = useParams();

  return (
    <div className="mypage-page-wrapper">
      <Header />
      <main className="mypage-main-content">
        <ModifyComponent email={email} />
      </main>
      <Footer />
    </div>
  );
};

export default ModifyPage;
