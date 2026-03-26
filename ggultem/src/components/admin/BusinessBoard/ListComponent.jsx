import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../../api/admin/BusinessBoardApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const host = API_SERVER_HOST;

const ListComponent = () => {
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    sign,
    category,
    moveToBusinessBoardList,
  } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [codeSearchType, setCodeSearchType] = useState("all");
  const [codeKeyword, setCodeKeyword] = useState("");
  const [adSign, setAdSign] = useState("all");
  const [adCategory, setAdCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType, sign, category }).then(
      (data) => {
        console.log(data);
        setServerData(data);
      },
    );
  }, [page, size, keyword, searchType, sign, category, refresh]);

  const handleReset = () => {
    setCodeKeyword(""); // 입력창 비우기
    setCodeSearchType("all");
    setAdSign("all");
    setAdCategory("all");
    navigate("/admin/businessboard/list");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    moveToBusinessBoardList({
      page: 1, // 검색 시에는 1페이지로 이동하는 게 좋습니다
      size,
      keyword: codeKeyword,
      searchType: codeSearchType,
      sign: adSign === "all" ? null : adSign,
      category: adCategory === "all" ? null : adCategory,
    });
  };

  return (
    <div className="businessboard-list-wrapper">
      <div className="businessboard-list-container">
        {/* 헤더 섹션 */}
        <div className="businessboard-header">
          <div className="title-group">
            <h2 className="businessboard-title">
              <span className="businessboard-title-point">꿀템</span> 비즈니스
              광고 관리
            </h2>
            <p className="businessboard-subtitle">
              비즈니스 광고가 등록된 리스트입니다.
            </p>
          </div>
          <form className="codegroup-search-form" onSubmit={handleSearch}>
            <div className="codegroup-actions">
              <select
                className="admin-search status-filter"
                value={adSign}
                onChange={(e) => setAdSign(e.target.value)}
              >
                <option value="all">광고상태</option>
                <option value="true">승인 광고</option>
                <option value="false">비승인 광고</option>
              </select>
              <select
                className="admin-search status-filter"
                value={adCategory}
                onChange={(e) => setAdCategory(e.target.value)}
              >
                <option value="all">광고구분</option>
                <option value="powershoping">파워쇼핑</option>
                <option value="powerlink">파워링크</option>
              </select>
              <select
                className="admin-search"
                value={codeSearchType}
                onChange={(e) => setCodeSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="writer">비즈니스 회원명</option>
              </select>
              <input
                type="text"
                value={codeKeyword}
                onChange={(e) => setCodeKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <button type="submit" className="search-btn-wide">
                🍯 검색
              </button>
            </div>
          </form>
          <div className="admin-btn-group">
            <button className="admin-btn reset-btn" onClick={handleReset}>
              목록 초기화
            </button>
          </div>
        </div>

        {/* 테이블 섹션 - 요청하신 항목들로 구성 */}
        <div className="businessboard-table-wrapper">
          <table className="businessboard-table">
            <thead>
              <tr>
                <th>회원 이메일</th>
                <th>닉네임</th>
                <th>광고제목</th>
                <th>광고종류</th>
                <th>클릭수</th>
                <th>광고등록일</th>
                <th>광고종료일</th>
                <th>광고 승인</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((item) => (
                  <tr
                    key={item.email}
                    className="businessboard-tr"
                    onClick={() => navigate(`/admin/businessboard/${item.no}`)}
                  >
                    <td className="businessboard-td-email">{item.email}</td>
                    <td>{item.writer}</td>
                    <td className="business-td-title">{item.title}</td>
                    <td className="business-td-category">{item.category}</td>
                    <td className="business-td-viewCount">
                      {item.viewCount} 회
                    </td>
                    <td className="businessboard-td-regdate">
                      {item.regDate ? item.regDate.split("T")[0] : "-"}
                    </td>
                    <td className="businessboard-td-enddate">
                      {item.endDate ? item.endDate.split("T")[0] : "-"}
                    </td>
                    <td className="businessboard-td-status">
                      {/* 활성화 여부에 따라 다른 스타일 적용 */}
                      <span
                        className={`businessboard-status-dot ${item.sign === true ? "active" : "inactive"}`}
                      >
                        {item.sign === true ? "승인" : "비승인"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    등록된 비즈니스 광고 상품이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="businessboard-pagination-wrapper">
          <PageComponent
            serverData={serverData}
            moveToList={moveToBusinessBoardList}
          />
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
