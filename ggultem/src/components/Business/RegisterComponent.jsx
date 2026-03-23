import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { postAdd, verifyBusinessApi } from "../../api/BusinessApi"; // API 경로는 프로젝트에 맞게 확인해주세요!
import "./RegisterComponent.css";
import { getCookie } from "../../util/cookieUtil";

// initState를 함수형으로 선언하거나 초기값 설정 시 바로 읽기
const getInitialState = () => {
  const memberInfo = getCookie("member");
  return {
    email: memberInfo?.email || "", // 쿠키 있으면 넣고 없으면 빈값
    businessNumber: "",
    companyName: "",
  };
};

const RegisterPage = () => {
  const [business, setBusiness] = useState(getInitialState);
  const [isVerified, setIsVerified] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // '로그인 여부'만 체크
    const memberInfo = getCookie("member");
    if (!memberInfo || !memberInfo.email) {
      alert("로그인이 필요한 서비스입니다.");
      nav("/login");
    }
  }, [nav]);

  const handleChangeBusiness = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = () => {
    if (!business.businessNumber) {
      alert("사업자 번호를 입력해주세요.");
      return;
    }

    // ✨ 실제 API 함수(verifyBusinessApi)를 호출해야 합니다.
    verifyBusinessApi(business.businessNumber)
      .then((res) => {
        if (res === true || res.isValid === true) {
          // 백엔드 응답 형식에 맞춤
          alert("국세청 인증에 성공했습니다!");
          setIsVerified(true);
        } else {
          alert("유효하지 않은 사업자 번호입니다.");
          setIsVerified(false);
        }
      })
      .catch((err) => {
        alert("인증 서비스 점검 중입니다.");
      });
  };

  const handleClickAdd = () => {
    // ✨ 인증 여부 체크 추가
    if (!isVerified) {
      alert("먼저 사업자 인증을 완료해주세요.");
      return;
    }

    if (!business.companyName) {
      alert("상호명을 입력해주세요.");
      return;
    }

    postAdd(business).then((data) => {
      alert("비즈니스 신청이 완료되었습니다.");
      nav(-1, { replace: true });
    });
  };

  return (
    <div className="business-register-container">
      <div className="business-register-card">
        <h2 className="business-register-title">비즈니스 회원 신청</h2>

        <div className="business-register-form">
          {/* 이메일 입력 (수정 불가) */}
          <div className="business-form-group">
            <label>계정 이메일</label>
            <input
              type="email"
              name="email"
              value={business.email}
              readOnly
              className="business-input-readonly"
            />
            <p className="business-input-help">
              현재 로그인된 계정으로 신청됩니다.
            </p>
          </div>

          {/* 사업자 번호 입력 */}
          <div className="business-form-group">
            <label>사업자 등록 번호</label>
            <input
              type="text"
              name="businessNumber"
              value={business.businessNumber}
              onChange={handleChangeBusiness}
              readOnly={isVerified} // ✨ 인증되면 읽기 전용으로!
              className={isVerified ? "input-verified" : ""}
            />
            <button onClick={handleVerify} disabled={isVerified}>
              {isVerified ? "인증 완료 ✅" : "사업자 인증"}
            </button>
          </div>

          {/* 상호명 입력 */}
          <div className="business-form-group">
            <label>상호명 (회사명)</label>
            <input
              type="text"
              name="companyName"
              value={business.companyName}
              onChange={handleChangeBusiness}
              placeholder="사업자 등록증상의 상호명을 입력하세요"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="business-register-buttons">
            <button className="business-btn-cancel" onClick={() => nav(-1)}>
              취소
            </button>
            <button
              className="business-btn-submit"
              onClick={handleClickAdd}
              disabled={!isVerified} // ✨ 인증 안 되면 클릭 불가!
              style={{ opacity: isVerified ? 1 : 0.5 }} // 시각적 피드백
            >
              신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
