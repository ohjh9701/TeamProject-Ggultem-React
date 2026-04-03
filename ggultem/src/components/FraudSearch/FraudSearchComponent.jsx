import React, { useState, useRef } from "react";
import "./FraudSearchComponent.css"; // 🚩 파일명이 맞는지 꼭 확인하세요!
import { getList } from "../../api/admin/BlackListApi";

const FraudSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const normalize = (str) => (str || "").trim().toLowerCase();

  const handleSearch = async () => {
    const rawInput = inputRef.current?.value || "";
    const keyword = normalize(rawInput);

    if (!keyword) {
      alert("이메일을 정확히 입력해주세요. 🐝");
      return;
    }

    setLoading(true);
    setSearchResult(null);
    setHasSearched(false);

    try {
      const data = await getList({
        page: 1,
        size: 10,
        searchType: "e",
        keyword: rawInput,
      });

      const now = new Date();
      const list = Array.isArray(data?.dtoList) ? data.dtoList : [];
      const exactMatches = list.filter(
        (item) => normalize(item?.email) === keyword,
      );

      if (exactMatches.length === 0) {
        setSearchResult(null);
        setHasSearched(true);
        return;
      }

      const validUser = exactMatches.find((item) => {
        const isExpired = item.endDate && new Date(item.endDate) < now;
        return item.status === "Y" && !isExpired;
      });

      setSearchResult(validUser || null);
      setHasSearched(true);
    } catch (error) {
      console.error("조회 실패:", error);
      alert("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fraud-container">
      {/* ✅ 1. 검색바 영역 (부드러운 라운드 스타일) */}
      <div className="fraud-search-bar">
        <input
          ref={inputRef}
          className="fraud-search-input"
          type="text"
          placeholder="이메일 전체 주소를 입력하세요"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="fraud-search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "..." : "검색"}
        </button>
      </div>

      {/* ✅ 2. 결과 카드 (위험 시 danger 클래스 추가) */}
      <div className={`fraud-result-card ${searchResult ? "danger" : ""}`}>
        {!hasSearched ? (
          <div className="placeholder-text">
            검색창에 이메일을 입력하고 <br />
            <b>안전한 꿀템 거래</b>를 시작하세요!
          </div>
        ) : searchResult ? (
          /* 위험 결과 */
          <div className="danger-content">
            <div className="icon-danger">⚠️</div>
            <h2 className="title-danger">블랙리스트 등록 사용자입니다.</h2>
            <table className="fraud-table">
              <tbody>
                <tr>
                  <th>이메일</th>
                  <td>{searchResult.email}</td>
                </tr>
                <tr>
                  <th>사유</th>
                  <td className="status-active">{searchResult.reason}</td>
                </tr>
                <tr>
                  <th>기간</th>
                  <td>
                    {searchResult.startDate?.split("T")[0]} ~
                    {searchResult.endDate
                      ? searchResult.endDate.split("T")[0]
                      : " 영구"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* 안전 결과 */
          <div className="safe-content">
            <div className="icon-safe">🛡️</div>
            <h2 className="title-safe">안심하고 거래하셔도 좋습니다!</h2>
            <p className="safe-desc">
              "<b>{inputRef.current?.value}</b>" 님은 <br />
              현재 블랙리스트에 등록되어 있지 않습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudSearch;
