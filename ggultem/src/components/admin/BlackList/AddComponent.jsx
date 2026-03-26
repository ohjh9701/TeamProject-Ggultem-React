import React, { useState } from "react";
// 💡 getList를 추가로 import하여 중복 체크에 사용합니다.
import {
  postAdd,
  checkMemberByEmail,
  getList,
} from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";

const initState = {
  email: "",
  reason: "",
  endDate: "", // yyyy-MM-dd 형식 저장
};

const AddComponent = () => {
  const [blackList, setBlackList] = useState({ ...initState });
  const [isVerifying, setIsVerifying] = useState(false);
  const { moveToBlackListList } = useCustomMove();

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  const handleClickAdd = async () => {
    // 1. 필수 입력값 체크
    if (!blackList.email) {
      alert("차단할 유저의 이메일을 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      // 2. [검증 A] Member 테이블에 해당 이메일이 있는지 확인
      const exists = await checkMemberByEmail(blackList.email);

      if (!exists) {
        alert(
          "존재하지 않는 회원 이메일입니다. 가입된 회원만 차단 가능합니다.",
        );
        setIsVerifying(false);
        return;
      }

      // 3. [검증 B] 💡 중복 차단 여부 확인 (핵심 로직 추가)
      // 현재 입력한 이메일로 검색하여 결과가 있는지 확인합니다.
      const searchResult = await getList({
        page: 1,
        size: 10,
        searchType: "e",
        keyword: blackList.email,
      });

      // 결과 중 status가 'Y'인 데이터가 하나라도 있으면 중복으로 간주
      const isAlreadyBlocked = searchResult.dtoList?.some(
        (item) => item.email === blackList.email && item.status === "Y",
      );

      if (isAlreadyBlocked) {
        alert(`이미 차단 중(Y)인 유저입니다.\n중복으로 등록할 수 없습니다.`);
        setIsVerifying(false);
        return;
      }

      // 4. [데이터 보정]
      const dataToSend = {
        email: blackList.email,
        reason: blackList.reason || "사유 없음",
        adminId: "admin_01", // 백엔드 DTO 필수값
        status: "Y",
        endDate: blackList.endDate ? `${blackList.endDate}T23:59:59` : null,
      };

      console.log("서버로 전송되는 최종 데이터:", dataToSend);

      // 5. [서버 전송]
      const result = await postAdd(dataToSend);
      console.log("등록 결과:", result);

      alert("해당 유저가 블랙리스트에 등록되었습니다.");
      moveToBlackListList();
    } catch (error) {
      console.error(
        "차단 등록 중 상세 오류:",
        error.response?.data || error.message,
      );
      alert(
        "등록에 실패했습니다. 입력한 이메일이나 날짜 형식을 다시 확인해주세요.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#333" }}>
        신규 블랙리스트 등록
      </h3>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          차단 대상 이메일
        </label>
        <input
          type="email"
          name="email"
          value={blackList.email}
          onChange={handleChange}
          placeholder="user@example.com"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          * 이미 차단된 회원은 중복 등록이 불가능합니다.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          차단 사유
        </label>
        <textarea
          name="reason"
          value={blackList.reason}
          onChange={handleChange}
          placeholder="차단 사유를 상세히 입력하세요"
          style={{
            width: "100%",
            padding: "10px",
            minHeight: "100px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            resize: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          차단 종료일
        </label>
        <input
          type="date"
          name="endDate"
          value={blackList.endDate}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <span style={{ fontSize: "13px", color: "#888", marginLeft: "10px" }}>
          (미지정 시 영구 차단으로 처리됩니다)
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleClickAdd}
          disabled={isVerifying}
          style={{
            padding: "12px 24px",
            backgroundColor: isVerifying ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isVerifying ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "background 0.2s",
          }}
        >
          {isVerifying ? "검증 및 등록 중..." : "차단 등록"}
        </button>
        <button
          onClick={moveToBlackListList}
          style={{
            padding: "12px 24px",
            backgroundColor: "#f1f3f5",
            color: "#495057",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default AddComponent;
