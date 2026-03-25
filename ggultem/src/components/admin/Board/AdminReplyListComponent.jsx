import { useEffect, useState } from "react";
import { getAdminReplyList, deleteReply } from "../../../api/admin/adminBoardApi";
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

  // 🔥 데이터 로딩
  const loadData = () => {
    const params = {
      page,
      size: 10,

      // 🔥 핵심 수정
      enabled: enabled === "" ? null : Number(enabled),
      keyword: keyword.trim() === "" ? null : keyword.trim(),
    };

    getAdminReplyList(params, token).then((data) => {
      console.log("서버 응답:", data);

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

  // 🔥 페이지 변경 시 호출
  useEffect(() => {
    loadData();
  }, [page]);

  // 🔥 검색 (페이지 초기화)
  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  // 🔥 삭제
  const handleDelete = async (replyNo) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteReply(replyNo, token);
      alert("댓글이 삭제되었습니다.");
      loadData();
    } catch {
      alert("삭제 실패");
    }
  };

  const movePage = (pageNum) => {
    setPage(pageNum);
  };

  return (
    <div className="admin-reply-list">

      <div className="admin-reply-header">
        <h2>댓글 관리</h2>

        <button onClick={() => navigate("/admin/board/list")}>
          게시글 관리
        </button>
      </div>

      <div className="admin-reply-search">
        <input
          type="text"
          placeholder="댓글 내용 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={enabled} onChange={(e) => setEnabled(e.target.value)}>
          <option value="">전체</option>
          <option value="1">활성</option>
          <option value="0">삭제됨</option>
        </select>

        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 🔥 데이터 없을 때 */}
      {serverData.dtoList.length === 0 && (
        <div style={{ marginTop: "20px", color: "#888" }}>
          조회된 댓글이 없습니다.
        </div>
      )}

      {/* 🔥 리스트 */}
      {serverData.dtoList.map((reply) => (
        <div
          key={reply.replyNo}
          className={`admin-reply-item ${reply.enabled === 0 ? "deleted" : ""}`}
        >
          <div>
            {reply.parentReplyNo && <span>↳</span>}

            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/board/read/${reply.boardNo}`)}
            >
              {reply.content}
            </span>

            <span> - {reply.writer}</span>

            {reply.enabled === 0 && <span>(삭제됨)</span>}
          </div>

          <button onClick={() => handleDelete(reply.replyNo)}>
            삭제
          </button>
        </div>
      ))}

      {/* 🔥 페이징 */}
      {serverData.pageNumList.length > 0 && (
        <div className="pagination">

          {serverData.prev && (
            <button onClick={() => movePage(serverData.prevPage)}>이전</button>
          )}

          {serverData.pageNumList.map((num) => (
            <button
              key={num}
              onClick={() => movePage(num)}
              style={{
                fontWeight: num === serverData.current ? "bold" : "normal",
              }}
            >
              {num}
            </button>
          ))}

          {serverData.next && (
            <button onClick={() => movePage(serverData.nextPage)}>다음</button>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminReplyListComponent;