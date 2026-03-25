import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getList } from "../../../api/admin/ItemBoardApi";
import PageComponent from "../../common/PageComponent";
import "./AdminListComponent.css";

const AdminListComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  // URL에서 검색 타입과 키워드 가져오기
  const searchType = searchParams.get("searchType") || "all";
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 10;

  // [중요] 페이지 이동 시 경로 수정 (admin 필수)
  const moveToList = (pageParam) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageParam.page);
    params.set("searchType", searchType);
    params.set("keyword", keyword);

    // /admin/itemBoard/list로 가야 관리자 페이지가 유지됩니다.
    navigate(`/admin/itemBoard/list?${params.toString()}`);
  };

  useEffect(() => {
    // API 호출 시 현재 검색 조건 포함
    getList({ page, size, searchType, keyword }).then((data) =>
      setServerData(data),
    );
  }, [page, size, searchType, keyword]); // 검색 조건이 바뀔 때마다 다시 로드

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box">
        <div className="admin-header">
          <h3 className="admin-title">
            상품 관리 <span className="yellow-point">마스터</span>
          </h3>

          {/* 검색 영역 추가 */}
          <div className="admin-search-bar">
            <select id="searchType" defaultValue={searchType}>
              <option value="all">전체</option>
              <option value="title">상품명</option>
              <option value="writer">판매자</option>
            </select>
            <input
              type="text"
              id="searchKeyword"
              defaultValue={keyword}
              placeholder="검색어를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const type = document.getElementById("searchType").value;
                  const word = document.getElementById("searchKeyword").value;
                  navigate(
                    `/admin/itemBoard/list?page=1&searchType=${type}&keyword=${word}`,
                  );
                }
              }}
            />
            <button
              className="search-btn"
              onClick={() => {
                const type = document.getElementById("searchType").value;
                const word = document.getElementById("searchKeyword").value;
                navigate(
                  `/admin/itemBoard/list?page=1&searchType=${type}&keyword=${word}`,
                );
              }}
            >
              검색
            </button>
          </div>

          <button
            className="yellow-btn"
            onClick={() => navigate("/admin/itemBoard/register")}
          >
            신규 상품 등록
          </button>
          <button
            className="yellow-btn"
            onClick={() => navigate("/admin/businessmember/list")}
          >
            비즈니스 게시판
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>카테고리</th>
              <th>상품명</th>
              <th>판매자</th>
              <th>가격</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/admin/itemBoard/read/${item.id}`)}
              >
                <td>{item.id}</td>
                <td>
                  <span className="cat-badge">{item.category}</span>
                </td>
                <td className="text-left">
                  <strong>{item.title}</strong>
                </td>
                <td>{item.nickname || item.writer}</td>
                <td className="price-bold">{item.price?.toLocaleString()}원</td>
                <td>{new Date(item.regDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-paging">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default AdminListComponent;
