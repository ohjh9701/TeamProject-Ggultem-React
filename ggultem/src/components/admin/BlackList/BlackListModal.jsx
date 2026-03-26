import React, { useEffect, useState } from "react";
// API 함수들 import 확인
import {
  getOne,
  putOne,
  deleteOne,
  getList,
} from "../../../api/admin/BlackListApi";

const initState = {
  blId: 0,
  email: "",
  reason: "",
  adminId: "",
  status: "",
  startDate: "",
  endDate: "",
};

const BlackListModal = ({ blId, callbackFn }) => {
  const [blackList, setBlackList] = useState({ ...initState });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blId) {
      getOne(blId).then((data) => {
        setBlackList({ ...data });
      });
    }
  }, [blId]);

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  // --- 💡 [수정] 내용 수정 버튼 핸들러 (async/await 및 에러 처리 추가) ---
  const handleClickModify = async () => {
    if (!window.confirm("내용을 수정하시겠습니까?")) return;

    setLoading(true);
    try {
      // 날짜 데이터가 비어있을 경우 처리 (백엔드 LocalDateTime 형식 맞춤)
      const formattedData = {
        ...blackList,
        endDate: blackList.endDate
          ? blackList.endDate.includes("T")
            ? blackList.endDate
            : `${blackList.endDate}T23:59:59`
          : null,
      };

      console.log("수정 요청 데이터:", formattedData);

      const response = await putOne(formattedData);
      console.log("수정 응답 결과:", response);

      alert("성공적으로 수정되었습니다.");
      callbackFn(true); // 대시보드 리스트 갱신 및 모달 닫기
    } catch (error) {
      console.error(
        "수정 중 오류 발생:",
        error.response?.data || error.message,
      );
      alert("수정에 실패했습니다. 입력값을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // --- 💡 재차단/해제 토글 핸들러 (기존 중복체크 포함) ---
  const handleClickToggleStatus = async () => {
    const isActive = blackList.status === "Y";

    if (isActive) {
      if (window.confirm("정말 차단을 해제하시겠습니까?")) {
        setLoading(true);
        try {
          await deleteOne(blId);
          alert("차단이 해제되었습니다.");
          callbackFn(true);
        } catch (error) {
          alert("해제 실패");
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (window.confirm("이 사용자를 다시 차단하시겠습니까?")) {
        setLoading(true);
        try {
          // 중복 체크
          const searchResult = await getList({
            page: 1,
            size: 10,
            searchType: "e",
            keyword: blackList.email,
          });

          const alreadyActive = searchResult.dtoList?.some(
            (item) => item.email === blackList.email && item.status === "Y",
          );

          if (alreadyActive) {
            alert(
              `이미 차단 중(Y)인 동일 이메일 기록이 존재합니다.\n중복 차단은 불가능합니다.`,
            );
            setLoading(false);
            return;
          }

          const updatedData = {
            ...blackList,
            status: "Y",
            endDate: blackList.endDate
              ? blackList.endDate.includes("T")
                ? blackList.endDate
                : `${blackList.endDate}T23:59:59`
              : null,
          };

          await putOne(updatedData);
          alert("다시 차단되었습니다.");
          callbackFn(true);
        } catch (error) {
          alert("재차단 실패");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const isActive = blackList.status === "Y";

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={{ color: isActive ? "#E03131" : "#333", marginTop: 0 }}>
          블랙리스트 상세 ({isActive ? "차단 중" : "해제됨"})
        </h3>
        <hr />

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>EMAIL</label>
          <input
            style={{ ...modalStyles.input, backgroundColor: "#f8f9fa" }}
            type="text"
            value={blackList.email}
            readOnly
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>차단 사유</label>
          <textarea
            style={{ ...modalStyles.input, height: "80px", resize: "none" }}
            name="reason"
            value={blackList.reason || ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>관리자 ID</label>
          <input
            style={modalStyles.input}
            type="text"
            name="adminId"
            value={blackList.adminId || ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.formGroup}>
          <label style={modalStyles.label}>종료일 설정</label>
          <input
            style={modalStyles.input}
            type="date"
            name="endDate"
            value={blackList.endDate ? blackList.endDate.split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>

        <div style={modalStyles.buttonArea}>
          <button
            onClick={handleClickModify}
            style={modalStyles.modifyBtn}
            disabled={loading}
          >
            {loading ? "처리 중..." : "내용 수정"}
          </button>
          <button
            onClick={handleClickToggleStatus}
            style={isActive ? modalStyles.deleteBtn : modalStyles.reBlockBtn}
            disabled={loading}
          >
            {isActive ? "차단 해제" : "다시 차단"}
          </button>
          <button
            onClick={() => callbackFn(false)}
            style={modalStyles.closeBtn}
            disabled={loading}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "450px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  formGroup: { marginBottom: "15px", display: "flex", flexDirection: "column" },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  buttonArea: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  modifyBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#228be6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  closeBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  deleteBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#495057",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  reBlockBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    backgroundColor: "#E03131",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
  },
};

export default BlackListModal;
