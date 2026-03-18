import React from "react";
import "./InfoModal.css"; // CSS 파일 임포트

const InfoModal = ({ show, title, content, callbackFn }) => {
  // show가 false이면 아무것도 렌더링하지 않음
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={callbackFn}>
      {/* stopPropagation은 모달 내부 클릭 시 닫히지 않게 함 */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>{title}</h4>
          {/* 상단 X 버튼 (선택 사항) */}
          <span
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={callbackFn}
          >
            &times;
          </span>
        </div>

        <div className="modal-body">
          <div className="modal-text">{content}</div>
          <div className="modal-footer">
            <button
              className="modal-close-btn"
              type="button"
              onClick={callbackFn}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
