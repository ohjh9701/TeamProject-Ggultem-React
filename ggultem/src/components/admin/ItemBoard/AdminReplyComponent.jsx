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
        alert("비활성화 되었습니다. 🍯");
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
    <div className="itemreply-list-wrapper">
      <div className="itemreply-list-container">
        {/* 헤더 섹션 */}
        <div className="itemreply-header">
          <div className="itemreply-group">
            <h2 className="itemreply-title">
              <span className="itemreply-title-point">꿀템</span> 중고거래 상품
              댓글 관리
            </h2>
            <p className="itemreply-subtitle">
              회원이 등록한 중고거래 상품의 댓글 목록입니다.
            </p>
          </div>

          {/* 검색 폼 스타일 통일 */}
          <div className="codegroup-search-form">
            <div className="codegroup-actions">
              <select
                className="admin-btn select"
                value={enabled}
                onChange={(e) => navigate(`?page=1&enabled=${e.target.value}`)}
              >
                <option value="all">상태(전체)</option>
                <option value="1">활성</option>
                <option value="0">비활성</option>
              </select>
              <select
                className="admin-btn select"
                id="replySearchType"
                defaultValue={searchType}
              >
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
              <button className="search-btn-wide" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 우측 정렬 */}
        <div className="admin-btn-group">
          <button
            className="admin-btn item-btn"
            onClick={() => navigate("/admin/itemBoard/list")}
          >
            상품 관리 이동
          </button>
        </div>

        <div className="member-table-responsive">
          <table className="item-table">
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
                    <td className="item-text-left">{reply.itemTitle}</td>
                    <td className="item-text-left reply-content-td">
                      <span
                        className={
                          reply.enabled === 0 ? "reply-text-muted" : ""
                        }
                      >
                        {reply.content}
                      </span>
                    </td>
                    <td>{reply.nickname}</td>
                    <td>{reply.regDate?.split("T")[0]}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="item-status-container">
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-list">
                    해당 조건의 댓글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="item-pagination-wrapper">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminReplyComponent;
