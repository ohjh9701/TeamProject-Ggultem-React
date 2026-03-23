import { Link, useNavigate } from "react-router";
import "./Header.css";
// 로고 이미지 경로를 프로젝트 구조에 맞게 수정하세요 (예: src/assets/logo.png)
import logoImg from "../assets/logo.png";
import { getCookie, removeCookie } from "../util/cookieUtil";

export default function Header() {
  const navigate = useNavigate();

  const memberInfo = getCookie("member");

  // 1. memberInfo가 이미 객체인지, 아니면 파싱이 필요한 문자열인지 체크
  let loginState = null;

  if (memberInfo) {
    // 만약 데이터 타입이 string(문자열)이면 JSON.parse를 실행하고, 아니면 그대로 사용
    loginState =
      typeof memberInfo === "string" ? JSON.parse(memberInfo) : memberInfo;
  }

  const handleLogout = () => {
    removeCookie("member");
    alert("로그아웃 되었습니다. 다음에 또 만나요! 🐝");
    navigate("/");
    window.location.reload(); // 상태 반영을 위해 새로고침
  };

  return (
    <header className="header-custom-header">
      <nav className="header-nav-container">
        {/* 로고 영역 */}
        <div className="header-nav-left">
          <Link to="/" className="header-nav-logo">
            <img src={logoImg} alt="꿀템 로고" className="header-logo-img" />
          </Link>
        </div>

        {/* 메뉴 영역 */}
        <div className="header-nav-center">
          <Link to="/itemBoard/list" className="header-nav-link">
            중고거래
          </Link>
          <Link to="/report/list" className="header-nav-link">
            사기조회
          </Link>
          <Link to="/board/list" className="header-nav-link">
            커뮤니티
          </Link>
          <Link to="/notice/list" className="header-nav-link">
            공지사항
          </Link>
          <Link to="/business" className="header-nav-link">
            비즈니스
          </Link>
        </div>

        <div className="header-nav-right">
          {loginState ? (
            // ✅ 로그인 성공 시: 닉네임과 로그아웃 버튼
            <div className="header-user-menu">
              <Link
                //to={`/mypage/${loginState.email}`}
                to={`/mypage`}
                className="header-user-nickname"
              >
                🍯 {loginState.nickname}님
              </Link>
              <button
                onClick={handleLogout}
                className="header-nav-auth-btn logout"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // ✅ 로그아웃 상태 시: 로그인 버튼
            <Link to="/login" className="header-nav-auth-btn">
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
