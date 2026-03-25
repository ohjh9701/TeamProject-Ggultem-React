import { useEffect, useState } from "react";
import { getAdminList, deleteBoard } from "../../../api/admin/adminBoardApi";
import { useNavigate } from "react-router-dom";
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
  });

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [enabled, setEnabled] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  //  데이터 로딩
  const loadData = () => {
    const params = {
      page,
      size: 10,

      //  핵심 (댓글이랑 동일)
      enabled: enabled === "" ? null : Number(enabled),
      keyword: keyword.trim() === "" ? null : keyword.trim(),
    };

    getAdminList(params, token).then((data) => {
      console.log("게시글 서버 응답:", data);

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
  }, [page]);

  // 🔥 검색
  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  //  삭제
  const handleDelete = async (boardNo) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) return;

    try {
      await deleteBoard(boardNo, token);
      alert("삭제 완료");
      loadData();
    } catch {
      alert("삭제 실패");
    }
  };

  const movePage = (pageNum) => {
    setPage(pageNum);
  };

  return (
    <div className="admin-board-list">

      <div className="admin-board-header">
        <h2>게시글 관리</h2>

        <button onClick={() => navigate("/admin/reply/list")}>
          댓글 관리
        </button>
      </div>

      <div className="admin-board-search">
        <input
          type="text"
          placeholder="검색어 입력"
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

      {/*  데이터 없을 때 */}
      {serverData.dtoList.length === 0 && (
        <div style={{ marginTop: "20px", color: "#888" }}>
          조회된 게시글이 없습니다.
        </div>
      )}

      {/*  리스트 */}
      {serverData.dtoList.map((board) => (
        <div
          key={board.boardNo}
          className={`admin-board-item ${board.enabled === 0 ? "deleted" : ""}`}
        >
          <div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/board/read/${board.boardNo}`)}
            >
              {board.title}
            </span>

            <span> - {board.writer}</span>

            {board.enabled === 0 && <span>(삭제됨)</span>}
          </div>

          <button onClick={() => handleDelete(board.boardNo)}>
            삭제
          </button>
        </div>
      ))}

      {/*  페이징 */}
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

export default AdminBoardListComponent;