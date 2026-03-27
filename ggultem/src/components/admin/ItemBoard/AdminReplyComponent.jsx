import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminList, removeReply } from "../../../api/admin/ItemBoardReplyApi";
import PageComponent from "../../common/PageComponent";
import "./AdminReplyComponent.css";

const AdminReplyComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";
  const enabled = searchParams.get("enabled") || "all";

  useEffect(() => {
    const params = { page, size, searchType, keyword };
    if (enabled !== "all") params.enabled = Number(enabled);
    adminList(params).then((data) => setServerData(data));
  }, [page, size, enabled, searchType, keyword]);

  const moveToList = (pageParam) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageParam.page);
    navigate({ search: params.toString() });
  };

  const handleSearch = () => {
    const type = document.getElementById("replySearchType").value;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("searchType", type);
    if (searchTerm.trim()) params.set("keyword", searchTerm.trim());
    else params.delete("keyword");
    navigate({ search: params.toString() });
    setSearchTerm("");
  };

  const handleClickDelete = (e, replyNo) => {
    e.stopPropagation();
    if (window.confirm("해당 댓글을 비활성화 하시겠습니까?")) {
      removeReply(replyNo).then(() => {
        alert("비활성화 되었습니다.");
        adminList({
          page,
          size,
          searchType,
          keyword,
          enabled: enabled !== "all" ? Number(enabled) : undefined,
        }).then((data) => setServerData(data));
      });
    }
  };

  return (
    <div className="reply-main-wrapper">
      <div className="reply-content-box">
        <div className="reply-header">
          <h3 className="reply-title">
            댓글 관리 <span className="yellow-point">마스터</span>
          </h3>

          <div className="reply-search-bar">
            <select id="replySearchType" defaultValue={searchType}>
              <option value="all">전체</option>
              <option value="itemTitle">상품명</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="reply-search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>

          <div className="reply-header-right">
            <select
              className="reply-status-select"
              value={enabled}
              onChange={(e) => navigate(`?page=1&enabled=${e.target.value}`)}
            >
              <option value="all">전체 보기</option>
              <option value="1">활성 상태</option>
              <option value="0">비활성 상태</option>
            </select>
            <button
              className="reply-yellow-btn"
              onClick={() => navigate("/admin/itemBoard/list")}
            >
              상품 관리 이동
            </button>
          </div>
        </div>

        <table className="reply-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>상품명</th>
              <th className="reply-content-col">댓글 내용</th>
              <th>작성자</th>
              <th>등록일</th>
              <th>상태 관리</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((reply) => (
                <tr
                  key={reply.replyNo}
                  className={reply.parentReplyNo ? "reply-child-row" : ""}
                  onClick={() => navigate(`/itemBoard/read/${reply.itemId}`)}
                >
                  <td>{reply.replyNo}</td>
                  <td>{reply.itemTitle}</td>
                  <td className="reply-text-left">
                    <span
                      className={reply.enabled === 0 ? "reply-text-muted" : ""}
                    >
                      {reply.content}
                    </span>
                  </td>
                  <td>{reply.nickname}</td>
                  <td>{reply.regDate?.split("T")[0]}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {reply.enabled === 1 ? (
                      <button
                        className="reply-btn-delete"
                        onClick={(e) => handleClickDelete(e, reply.replyNo)}
                      >
                        비활성하기
                      </button>
                    ) : (
                      <span className="reply-label-disabled">비활성</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">해당 조건의 댓글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="reply-paging">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminReplyComponent;
