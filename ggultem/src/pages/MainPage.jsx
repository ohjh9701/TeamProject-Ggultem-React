import React, { useState } from "react";
import Header from "../include/Header";
import "./MainPage.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../include/Footer";
import logoImg from "../assets/logo.png";
import AD from "../include/business/AD";

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
          <h2>달콤한 득템, 꿀템!</h2>

          {/* ✅ 와이드 검색창 + 카테고리 선택 */}
          <form className="search-form-wide" onSubmit={handleSearch}>
            <select
              className="search-type-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="itemBoard">중고거래</option>
              <option value="board">커뮤니티</option>
              <option value="notice">공지사항</option>
            </select>

            <input
              type="text"
              className="search-input-wide"
              placeholder="동네에서 꿀템을 검색해보세요!"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="search-btn-wide">
              🍯검색
            </button>
          </form>
        </div>

        {/* 하단 버튼형 메뉴 */}
        <div className="content-wrapper-wide">
          <Link to="/itemBoard/list" className="content-card-wide">
            <div className="content-box">중고거래</div>
          </Link>
          <Link to="/report" className="content-card-wide">
            <div className="content-box">사기조회</div>
          </Link>
          <Link to="/board/list" className="content-card-wide">
            <div className="content-box">커뮤니티</div>
          </Link>
          <Link to="/notice/list" className="content-card-wide">
            <div className="content-box">공지사항</div>
          </Link>
        </div>
        <AD />
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
