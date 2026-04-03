import { useEffect, useState } from "react";
import {
  getAdminReplyList,
  deleteReply,
} from "../../../api/admin/adminBoardApi";
import { useNavigate } from "react-router-dom";
import "./AdminReplyListComponent.css";

const AdminReplyListComponent = () => {
  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    current: 1,
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
      enabled: enabled === "" ? null : Number(enabled),
      keyword: keyword.trim() === "" ? null : keyword.trim(),
    };

    getAdminReplyList(params, token).then((data) => {
      setServerData({
        dtoList: data?.dtoList || [],
        pageNumList: data?.pageNumList || [],
        prev: data?.prev || false,
        next: data?.next || false,
        prevPage: data?.prevPage || 0,
        nextPage: data?.nextPage || 0,
        current: data?.current || 1,
      });
    });
  };

  useEffect(() => {
    loadData();
  }, [page, enabled]); // enabled 변경 시 자동 로드 추가

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const handleDelete = async (replyNo) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteReply(replyNo, token);
      alert("댓글이 삭제되었습니다. 🍯");
      loadData();
    } catch {
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
              <span className="item-title-point">꿀템</span> 자유게시판 댓글
              관리
            </h2>
            <p className="item-subtitle">
              자유게시판에 등록된 전체 댓글 및 답글 목록입니다.
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
                placeholder="댓글 내용 검색"
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
            className="admin-btn item-btn"
            onClick={() => navigate("/admin/board/list")}
          >
            게시글 관리 이동
          </button>
        </div>

        {/* 테이블 섹션 */}
        <div className="member-table-responsive">
          <table className="item-table">
            <thead>
              <tr>
                <th>번호</th>
                <th className="reply-content-col">댓글 내용</th>
                <th>작성자</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((reply) => (
                  <tr
                    key={reply.replyNo}
                    className={reply.enabled === 0 ? "row-muted" : ""}
                  >
                    <td>{reply.replyNo}</td>
                    <td
                      className={`item-text-left ${reply.parentReplyNo ? "reply-child-cell" : ""}`}
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/board/read/${reply.boardNo}`)}
                        className={
                          reply.enabled === 0 ? "reply-text-muted" : ""
                        }
                      >
                        {reply.parentReplyNo && (
                          <span className="reply-arrow">↳</span>
                        )}
                        {reply.content}
                      </span>
                    </td>
                    <td>{reply.writer}</td>
                    <td>
                      <div className="item-status-container">
                        <span
                          className={`item-status-badge ${reply.enabled === 0 ? "deleted" : "active"}`}
                        >
                          <span className="item-dot"></span>
                          {reply.enabled === 0 ? "삭제됨" : "활성"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {reply.enabled === 1 && (
                        <button
                          className="reply-btn-delete"
                          onClick={() => handleDelete(reply.replyNo)}
                        >
                          삭제
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-list">
                    조회된 댓글이 없습니다. 🍯
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 */}
        <div className="item-pagination-wrapper">
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

export default AdminReplyListComponent;
