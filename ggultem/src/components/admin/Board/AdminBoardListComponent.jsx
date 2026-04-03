import { useEffect, useState } from "react";
import { getAdminList, deleteBoard } from "../../../api/admin/adminBoardApi";
import { useNavigate } from "react-router-dom";
import PageComponent from "../../common/PageComponent"; // 🚩 PageComponent 사용을 권장합니다.
import "./AdminBoardListComponent.css";

const AdminBoardListComponent = () => {
  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    current: 1,
    totalCount: 0, // 🚩 totalCount 추가
  });

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [enabled, setEnabled] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const loadData = () => {
    const params = {
      page,
      size: 10,
      enabled: enabled === "" ? undefined : Number(enabled),
      keyword: keyword.trim() === "" ? undefined : keyword.trim(),
    };

    getAdminList(params, token)
      .then((data) => {
        setServerData({
          dtoList: data?.dtoList || [],
          pageNumList: data?.pageNumList || [],
          prev: data?.prev || false,
          next: data?.next || false,
          prevPage: data?.prevPage || 0,
          nextPage: data?.nextPage || 0,
          current: data?.current || 1,
          totalCount: data?.totalCount || 0,
        });
      })
      .catch((err) => console.error("리스트 에러:", err));
  };

  useEffect(() => {
    loadData();
  }, [page, enabled]); // 🚩 enabled 변경 시 바로 로드되게 추가

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const handleDelete = async (boardNo) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) return;
    try {
      await deleteBoard(boardNo, token);
      alert("삭제 완료 🍯");
      loadData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="item-list-wrapper">
      <div className="item-list-container">
        {/* 헤더 섹션 */}
        <div className="item-header">
          <div className="title-group">
            <h2 className="item-title">
              <span className="item-title-point">꿀템</span> 커뮤니티 관리
            </h2>
            <p className="item-subtitle">
              자유게시판에 등록된 전체 게시글 목록입니다.
            </p>
          </div>

          <div className="codegroup-search-form">
            <div className="codegroup-actions">
              <select
                className="admin-btn select"
                value={enabled}
                onChange={(e) => setEnabled(e.target.value)}
              >
                <option value="">상태(전체)</option>
                <option value="1">활성</option>
                <option value="0">삭제됨</option>
              </select>
              <input
                type="text"
                placeholder="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn-wide" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="admin-btn-group">
          <button
            className="admin-btn reply-btn"
            onClick={() => navigate("/admin/reply/list")}
          >
            댓글 관리 이동
          </button>
        </div>

        {/* 테이블 섹션 */}
        <div className="member-table-responsive">
          <table className="item-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((board) => (
                  <tr
                    key={board.boardNo}
                    className={board.enabled === 0 ? "row-muted" : ""}
                  >
                    <td>{board.boardNo}</td>
                    <td
                      className="item-text-left"
                      onClick={() => navigate(`/board/read/${board.boardNo}`)}
                    >
                      <strong style={{ cursor: "pointer" }}>
                        {board.title}
                      </strong>
                    </td>
                    <td>{board.writer}</td>
                    <td>{board.regDate ? board.regDate.split("T")[0] : "-"}</td>
                    <td>
                      <div className="item-status-container">
                        <span
                          className={`item-status-badge ${board.enabled === 0 ? "deleted" : "active"}`}
                        >
                          <span className="item-dot"></span>
                          {board.enabled === 0 ? "삭제됨" : "활성"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {board.enabled === 1 && (
                        <button
                          className="reply-btn-delete"
                          onClick={() => handleDelete(board.boardNo)}
                        >
                          삭제
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-list">
                    조회된 게시글이 없습니다. 🍯
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 섹션 */}
        <div className="item-pagination-wrapper">
          {/* 🚩 기존 버튼 나열 대신 PageComponent를 쓰거나 아래 스타일을 쓰세요 */}
          <div className="pagination">
            {serverData.prev && (
              <button onClick={() => setPage(serverData.prevPage)}>이전</button>
            )}
            {serverData.pageNumList.map((num) => (
              <button
                key={num}
                className={num === serverData.current ? "active" : ""}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            {serverData.next && (
              <button onClick={() => setPage(serverData.nextPage)}>다음</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoardListComponent;
