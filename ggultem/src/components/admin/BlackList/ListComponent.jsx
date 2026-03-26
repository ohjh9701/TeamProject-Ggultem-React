import React, { useEffect, useState, useRef } from "react";
import { getList } from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  current: 0,
};

const miniData = [
  { v: 10 },
  { v: 25 },
  { v: 15 },
  { v: 30 },
  { v: 20 },
  { v: 40 },
];

const ListComponent = () => {
  const {
    page,
    size,
    keyword,
    searchType,
    refresh,
    moveToBlackListList,
    moveToAdd,
  } = useCustomMove();

  const [serverData, setServerData] = useState(initState);
  const [activeCount, setActiveCount] = useState(0);

  // 💡 검색창 참조를 위한 Ref
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // URL에 있는 검색 조건과 입력창 동기화
    if (selectRef.current) selectRef.current.value = searchType || "e";
    if (inputRef.current) inputRef.current.value = keyword || "";

    getList({ page, size, keyword, searchType })
      .then((data) => {
        setServerData(data);
        const countY = data.dtoList.filter(
          (item) => item.status === "Y",
        ).length;
        setActiveCount(countY);
      })
      .catch((err) => console.error("리스트 로딩 에러:", err));
  }, [page, size, keyword, searchType, refresh]);

  // 💡 검색 실행 핸들러
  const handleSearch = () => {
    const type = selectRef.current.value;
    const word = inputRef.current.value.trim();

    // useCustomMove의 이동 함수를 사용하여 URL 파라미터 변경
    moveToBlackListList({ page: 1, searchType: type, keyword: word });
  };

  return (
    <div
      className="blacklist-dashboard-wrapper"
      style={{ padding: "20px", backgroundColor: "#f8f9fa" }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
        블랙리스트 관리 대시보드
      </h2>

      {/* 📊 상단 요약 카드 섹션 */}
      <div
        className="stats-row"
        style={{ display: "flex", gap: "15px", marginBottom: "25px" }}
      >
        <div className="stats-card" style={cardStyle}>
          <div className="stats-info">
            <h4 style={labelStyle}>전체 차단 유저</h4>
            <p style={valueStyle}>{serverData.totalCount.toLocaleString()}명</p>
          </div>
          <div style={{ width: "60px", height: "30px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#007bff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-card" style={cardStyle}>
          <div className="stats-info">
            <h4 style={labelStyle}>현재 활성(Y)</h4>
            <p style={valueStyle}>{activeCount}명</p>
          </div>
          <div style={{ width: "60px", height: "30px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#28a745"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-card" style={cardStyle}>
          <div className="stats-info">
            <h4 style={labelStyle}>오늘 신규 등록</h4>
            <p style={valueStyle}>1건</p>
          </div>
          <div style={{ width: "60px", height: "30px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#ffc107"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔍 검색 바 추가 영역 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          alignItems: "center",
        }}
      >
        <select
          ref={selectRef}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        >
          <option value="e">이메일</option>
          <option value="r">차단 사유</option>
        </select>
        <input
          ref={inputRef}
          type="text"
          placeholder="검색어를 입력하세요..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            flex: 1,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 20px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          검색
        </button>
      </div>

      {/* 📋 리스트 영역 */}
      <div
        className="table-container"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            Blacklist Records ({serverData.totalCount})
          </span>
          <button
            className="admin-btn add-btn"
            onClick={moveToAdd}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0056b3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            신규 등록
          </button>
        </div>

        <table
          className="codegroup-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e9ecef", textAlign: "left" }}>
              <th style={thStyle}>BL_ID</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>REASON</th>
              <th style={thStyle}>ADMIN_ID</th>
              <th style={thStyle}>START_DATE</th>
              <th style={thStyle}>END_DATE</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((item) => (
                <tr
                  key={item.blId}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={tdStyle}>{item.blId}</td>
                  <td style={tdStyle}>{item.email}</td>
                  <td style={tdStyle}>{item.reason}</td>
                  <td style={tdStyle}>{item.adminId}</td>
                  <td style={tdStyle}>
                    {item.startDate ? item.startDate.split("T")[0] : "-"}
                  </td>
                  <td style={tdStyle}>
                    {item.endDate ? item.endDate.split("T")[0] : "영구"}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor:
                          item.status === "Y" ? "#dc3545" : "#6c757d",
                        color: "#fff",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      className="admin-btn biz-btn"
                      onClick={() =>
                        moveToBlackListList({
                          page,
                          type: "read",
                          blId: item.blId,
                        })
                      }
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div
          className="pagination-wrapper"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PageComponent
            serverData={serverData}
            movePage={moveToBlackListList}
          />
        </div>
      </div>
    </div>
  );
};

// ... 기존 스타일 객체(cardStyle 등) 동일
const cardStyle = {
  flex: 1,
  backgroundColor: "#fff",
  padding: "15px 20px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  border: "1px solid #eee",
};
const labelStyle = { fontSize: "14px", color: "#6c757d", margin: 0 };
const valueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "5px 0 0 0",
};
const thStyle = {
  padding: "12px 10px",
  fontSize: "13px",
  borderBottom: "2px solid #dee2e6",
};
const tdStyle = { padding: "12px 10px", fontSize: "13px" };

export default ListComponent;
