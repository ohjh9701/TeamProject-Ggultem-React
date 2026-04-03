import { useEffect, useState } from "react";
import { getReportList } from "../../../api/admin/ReportApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "../../common/PageComponent"; // 페이징 추가 확인!
import "./ReportListComponent.css";

const ListComponent = () => {
  const { page, size, moveToRead, moveToList } = useCustomMove();
  const [serverData, setServerData] = useState({
    dtoList: [],
    totalCount: 0,
    pageNumList: [],
    prev: false,
    next: false,
  });

  useEffect(() => {
    getReportList({ page, size }).then((data) => {
      if (data) {
        setServerData(data);
      }
    });
  }, [page, size]);

  return (
    <div className="report-list-wrapper">
      <div className="report-list-container">
        {/* 헤더 섹션: 다른 관리 페이지와 통일 */}
        <div className="report-header">
          <div className="title-group">
            <h2 className="report-title">
              <span className="report-title-point">꿀템</span> 신고 접수 관리
            </h2>
            <p className="report-subtitle">
              사용자들이 신고한 내역을 확인하고 처리하는 공간입니다.
            </p>
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className="member-table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>유형</th>
                <th>대상자</th>
                <th>상태</th>
                <th>신고일</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((report) => (
                  <tr
                    key={report.reportId}
                    className="report-tr"
                    onClick={() => moveToRead(report.reportId)}
                  >
                    <td>{report.reportId}</td>
                    <td>
                      <span className="report-type-badge">
                        {report.reportType || "유형 없음"}
                      </span>
                    </td>
                    <td className="report-target-bold">
                      {report.targetMemberId || "대상 없음"}
                    </td>
                    <td>
                      <div className="report-status-container">
                        <span
                          className={`report-status-badge ${report.status === 0 ? "pending" : "completed"}`}
                        >
                          <span className="report-dot"></span>
                          {report.status === 0 ? "접수 대기" : "처리 완료"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {report.regDate
                        ? new Date(report.regDate).toLocaleDateString()
                        : "날짜 정보 없음"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-list">
                    접수된 신고 내역이 존재하지 않습니다. 🍯
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 섹션 (PageComponent 사용 시) */}
        <div className="report-pagination-wrapper">
          <PageComponent serverData={serverData} moveToList={moveToList} />
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
