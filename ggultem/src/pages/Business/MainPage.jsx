import React, { useState } from "react";
import Header from "../../include/Header";
import "./MainPage.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../include/Footer";
import logoImg from "../../assets/logo.png";

const MainPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all"); // 카테고리 상태
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    // 선택한 카테고리와 키워드를 가지고 이동
    navigate(`/${searchType}/list?page=1&size=10&keyword=${keyword}`);
  };

  return (
    <div className="main-container">
      <Header />

      <main className="content-area">
        <div className="hero-section">
          <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          <h2>꿀템 비즈니스 센터</h2>

          {/* 하단 버튼형 메뉴 */}
          <div className="content-wrapper-wide">
            <Link to="/business/register" className="content-card-wide">
              <div className="content-box">비즈니스 회원 등록</div>
            </Link>
            <Link to="/business/list" className="content-card-wide">
              <div className="content-box">비즈니스 센터 이동</div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
