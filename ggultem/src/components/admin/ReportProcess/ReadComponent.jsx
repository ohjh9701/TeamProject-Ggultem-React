import { useEffect, useState } from "react";
import { getOneReport, getReportProcess } from "../../../api/admin/ReportApi";
import { API_SERVER_HOST } from "../../../api/config";
import ProcessComponent from "./ProcessComponent";
import { useNavigate } from "react-router-dom";
import "./ReadComponent.css";

const ReadComponent = ({ reportId }) => {
  const [report, setReport] = useState(null);
  const [processed, setProcessed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOneReport(reportId).then((data) => {
      setReport(data);
      if (data.status === 1) {
        getReportProcess(reportId)
          .then((processedData) => setProcessed(processedData))
          .catch((err) => console.error("처리 내역 조회 실패:", err));
      }
    });
  }, [reportId]);

  if (!report) return <div className="admin-main-wrapper">로딩 중...</div>;

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box">
        {/* 상단 헤더 */}
        <div className="admin-header">
          <h3 className="admin-title">
            신고 상세 확인{" "}
            <span className="yellow-point">No.{report.reportId}</span>
          </h3>
          <div className="btn-group">
            <button
              className="white-btn"
              onClick={() => navigate("/admin/report/list")}
            >
              목록으로
            </button>
          </div>
        </div>

        {/* 메인 섹션 (증거 이미지 + 신고 정보) */}
        <div className="product-main-section">
          <div className="image-area">
            <div className="img-holder">
              {report.uploadFileNames && report.uploadFileNames.length > 0 ? (
                <img
                  src={`${API_SERVER_HOST}/api/report/view/${report.uploadFileNames[0]}`}
                  alt="증거이미지"
                />
              ) : (
                <div className="no-img">증거 이미지 없음</div>
              )}
            </div>
          </div>

          <div className="product-info-area">
            <div className="info-label-group">
              <span className="cat-badge">{report.reportType}</span>
              <span className="location-text">
                상태: {report.status === 0 ? "접수 대기" : "처리 완료"}
              </span>
            </div>
            <h2 className="item-title">대상: {report.targetMemberId}</h2>
            <div className="item-price" style={{ color: "#e03131" }}>
              {report.targetType} No.{report.targetNo}
            </div>

            <div className="item-description-box">
              <label>신고 상세 사유</label>
              <div className="item-content">
                {report.reason || "상세 사유가 작성되지 않았습니다."}
              </div>
            </div>
            <div className="reg-date-info">
              신고일: {new Date(report.regDate).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 하단 섹션: 신고자 및 처리 정보 (그리드 배치) */}
        <div className="member-detail-section">
          <h4 className="section-title">신고 및 처리 정보</h4>
          <div className="member-info-grid">
            <div className="member-field">
              <label>신고자 이메일</label>
              <span>{report.memberEmail}</span>
            </div>
            {report.status === 1 ? (
              <>
                <div className="member-field">
                  <label>처리 담당 관리자</label>
                  <span>{processed?.adminEmail || "관리자 정보 없음"}</span>
                </div>
                <div className="member-field" style={{ gridColumn: "span 2" }}>
                  <label>관리자 처리 메모</label>
                  <span>{processed?.actionNote || "메모 없음"}</span>
                </div>
              </>
            ) : (
              <div className="member-field" style={{ gridColumn: "span 3" }}>
                <label>알림</label>
                <span className="yellow-point">
                  현재 처리가 필요한 신고 건입니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 처리 컴포넌트 (접수 대기 상태일 때만 노출) */}
        {report.status === 0 && (
          <div style={{ marginTop: "40px" }}>
            <ProcessComponent
              reportId={reportId}
              onComplete={() => {
                // 1. 먼저 신고 처리가 완료되었음을 알림
                alert("신고 처리가 완료되었습니다. 🍯");

                // 2. 블랙리스트 등록 여부 확인
                if (
                  window.confirm(
                    "해당 유저를 블랙리스트에 추가로 등록하시겠습니까?",
                  )
                ) {
                  navigate(
                    `/admin/blacklist/add?email=${report.targetMemberId}`,
                  );
                } else {
                  window.location.reload();
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadComponent;
