import React, { useEffect, useState } from "react";
import {
  postAdd,
  checkMemberByEmail,
  getList,
} from "../../../api/admin/BlackListApi";
import useCustomMove from "../../../hooks/useCustomMove";
import "./AddComponent.css";
import { useParams, useSearchParams } from "react-router";

const initState = {
  email: "",
  reason: "",
  endDate: "",
};

const AddComponent = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { moveToBlackListList } = useCustomMove();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || ""; // URL에서 email 파라미터 추출

  const [blackList, setBlackList] = useState({
    ...initState,
    email: emailParam, // 🚩 전달받은 이메일로 초기값 세팅!
  });

  const handleChange = (e) => {
    setBlackList({ ...blackList, [e.target.name]: e.target.value });
  };

  const handleClickAdd = async () => {
    if (!blackList.email) {
      alert("차단할 유저의 이메일을 입력해주세요. 🐝");
      return;
    }

    setIsVerifying(true);

    try {
      const exists = await checkMemberByEmail(blackList.email);
      if (!exists) {
        alert(
          "존재하지 않는 회원 이메일입니다. 가입된 회원만 차단 가능합니다.",
        );
        setIsVerifying(false);
        return;
      }

      const searchResult = await getList({
        page: 1,
        size: 10,
        searchType: "e",
        keyword: blackList.email,
      });
      const isAlreadyBlocked = searchResult.dtoList?.some(
        (item) => item.email === blackList.email && item.status === "Y",
      );

      if (isAlreadyBlocked) {
        alert(`이미 차단 중(Y)인 유저입니다.\n중복으로 등록할 수 없습니다.`);
        setIsVerifying(false);
        return;
      }

      const dataToSend = {
        email: blackList.email,
        reason: blackList.reason || "사유 없음",
        adminId: "admin_01",
        status: "Y",
        endDate: blackList.endDate ? `${blackList.endDate}T23:59:59` : null,
      };

      await postAdd(dataToSend);
      alert("해당 유저가 블랙리스트에 등록되었습니다. 🍯");
      moveToBlackListList();
    } catch (error) {
      alert(
        "등록에 실패했습니다. 입력한 이메일이나 날짜 형식을 다시 확인해주세요.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="admin-main-wrapper">
      <div className="admin-content-box blacklist-add-box">
        {/* 헤더 섹션 */}
        <div className="admin-header">
          <h3 className="admin-title">
            신규 블랙리스트 <span className="yellow-point">등록</span>
          </h3>
        </div>

        {/* 입력 폼 섹션 */}
        <div className="add-form-container">
          <div className="form-item">
            <label className="form-label">차단 대상 이메일</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={blackList.email}
              onChange={handleChange}
              placeholder="user@example.com"
            />
            <p className="form-help-text">
              * 가입된 회원만 등록 가능하며, 중복 등록은 불가능합니다.
            </p>
          </div>

          <div className="form-item">
            <label className="form-label">차단 사유</label>
            <textarea
              name="reason"
              className="form-textarea"
              value={blackList.reason}
              onChange={handleChange}
              placeholder="차단 사유를 상세히 입력하세요"
            />
          </div>

          <div className="form-item">
            <label className="form-label">차단 종료일</label>
            <div className="date-input-group">
              <input
                type="date"
                name="endDate"
                className="form-input date-input"
                value={blackList.endDate}
                onChange={handleChange}
              />
              <span className="date-help">
                (미지정 시 영구 차단으로 처리됩니다)
              </span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 그룹 */}
        <div className="admin-btn-group add-footer">
          <button className="white-btn" onClick={moveToBlackListList}>
            취소
          </button>
          <button
            className={`admin-btn add-btn ${isVerifying ? "loading" : ""}`}
            onClick={handleClickAdd}
            disabled={isVerifying}
          >
            {isVerifying ? "검증 중..." : "블랙리스트 등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
