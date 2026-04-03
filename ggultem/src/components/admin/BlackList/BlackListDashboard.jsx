import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { getList } from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent";
import BlackListModal from "./BlackListModal";
import "./BlackListDashboard.css"; // 🚩 대시보드 전용 CSS 추가

ChartJS.register(ArcElement, Tooltip, Legend);

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  current: 0,
};

const BlackListDashboard = () => {
  const { page, size, refresh, keyword, searchType, moveToAdd, movePage } =
    useCustomMove();
  const navigate = useNavigate();

  const [serverData, setServerData] = useState(initState);
  const [showModal, setShowModal] = useState(false);
  const [currentBlId, setCurrentBlId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const selectRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const querySearchType = searchType || "e";
    const queryKeyword = keyword || "";
    if (selectRef.current) selectRef.current.value = querySearchType;
    if (inputRef.current) inputRef.current.value = queryKeyword;

    getList({ page, size, searchType: querySearchType, keyword: queryKeyword })
      .then((data) => setServerData(data || initState))
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [page, size, refresh, keyword, searchType]);

  const filteredList =
    serverData.dtoList?.filter((item) => {
      if (filterStatus === "ALL") return true;
      return item.status === filterStatus;
    }) || [];

  const handleSearch = () => {
    const type = selectRef.current.value;
    const word = inputRef.current.value.trim();
    movePage({ page: 1, searchType: type, keyword: word });
  };

  const handleMoveToAddWithCheck = () => {
    const inputEmail = inputRef.current?.value.trim();
    if (inputEmail && selectRef.current?.value === "e") {
      const isAlreadyActive = serverData.dtoList.some(
        (item) => item.email === inputEmail && item.status === "Y",
      );
      if (isAlreadyActive) {
        alert(`[${inputEmail}]님은 이미 차단(Y) 상태입니다. 🐝`);
        return;
      }
    }
    moveToAdd();
  };

  const closeAfterAction = (isChanged) => {
    setShowModal(false);
    setCurrentBlId(null);
    if (isChanged) movePage({ page, searchType, keyword });
  };

  const activeCount =
    serverData.dtoList?.filter((item) => item.status === "Y").length || 0;
  const inactiveCount = (serverData.dtoList?.length || 0) - activeCount;

  const chartData = {
    labels: ["BlackList", "None"],
    datasets: [
      {
        label: "차단 상태 비율",
        data: [activeCount, inactiveCount],
        backgroundColor: ["#FF4D4D", "#FFD700"],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="item-list-wrapper dashboard-root">
      <div className="item-list-container">
        {/* 통계 섹션 */}
        <div className="stats-card-box">
          <div className="stats-text-content">
            <h2 className="item-title">
              Blacklist <span className="item-title-point">Statistics</span>
            </h2>
            <p className="stats-info">
              전체 누적 기록: <strong>{serverData.totalCount}</strong>건
            </p>
            <p className="stats-info">
              현재 블랙리스트 회원 수:{" "}
              <span className="status-highlight-red">{activeCount}명</span>
            </p>
          </div>
          <div className="chart-container">
            {serverData.dtoList?.length > 0 ? (
              <Doughnut data={chartData} options={chartOptions} />
            ) : (
              <div className="no-data-chart">데이터 없음</div>
            )}
          </div>
        </div>

        {/* 검색 바 */}
        <div className="item-header">
          <div className="title-group">
            <h2 className="item-title">
              <span className="item-title-point">꿀템</span> 블랙리스트 관리
            </h2>
            <p className="item-subtitle">
              블랙리스트에 등록된 회원 목록입니다.
            </p>
          </div>
          <div className="codegroup-search-form">
            <div className="codegroup-actions">
              <select ref={selectRef} className="admin-btn select">
                <option value="e">이메일</option>
                <option value="r">차단 사유</option>
              </select>
              <input
                ref={inputRef}
                type="text"
                placeholder="검색어를 입력하세요..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn-wide" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="filter-tab-group">
          <button className="btn-blue-add" onClick={handleMoveToAddWithCheck}>
            신규 유저 차단
          </button>
          {[
            { id: "ALL", label: "전체 목록" },
            { id: "Y", label: "BlackList" },
            { id: "N", label: "None" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`admin-btn tab-btn ${filterStatus === tab.id ? "active" : ""}`}
              onClick={() => setFilterStatus(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="member-table-responsive">
          <table className="item-table dashboard-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>ID</th>
                <th>EMAIL</th>
                <th>REASON</th>
                <th>ADMIN</th>
                <th>START_DATE</th>
                <th>END_DATE</th>
                <th style={{ width: "100px" }}>STATUS</th>
                <th style={{ width: "120px" }}>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item) => {
                  const isActive = item.status === "Y";
                  return (
                    <tr
                      key={item.blId}
                      className={isActive ? "row-danger" : ""}
                    >
                      <td className={`id-cell ${isActive ? "danger" : ""}`}>
                        {item.blId}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.reason}</td>
                      <td>{item.adminId || "관리자"}</td>
                      <td>{item.startDate?.split("T")[0]}</td>
                      <td>
                        {isActive
                          ? item.endDate
                            ? item.endDate.split("T")[0]
                            : "영구(차단중)"
                          : item.endDate?.split("T")[0] || "-"}
                      </td>
                      <td>
                        <div className="item-status-container">
                          <span
                            className={`item-status-badge ${isActive ? "deleted" : "active"}`}
                          >
                            <span className="item-dot"></span>
                            {isActive ? "BlackList" : "None"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`btn-detail ${isActive ? "active" : ""}`}
                          onClick={() =>
                            setCurrentBlId(item.blId) || setShowModal(true)
                          }
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-list">
                    데이터가 존재하지 않습니다. 🍯
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="item-pagination-wrapper">
          <PageComponent serverData={serverData} movePage={movePage} />
        </div>
      </div>
      {showModal && (
        <BlackListModal blId={currentBlId} callbackFn={closeAfterAction} />
      )}
    </div>
  );
};

export default BlackListDashboard;
