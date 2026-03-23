import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginPostAsync, logout } from "../slice/loginSlice";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.loginSlice); //-------로그인 상태
  const isLogin = loginState.email ? true : false; //----------로그인 여부

  const doLogin = async (loginParam) => {
    //----------로그인 함수
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  };
  const doLogout = () => {
    //---------------로그아웃 함수
    dispatch(logout());
  };
  const moveToPath = (path) => {
    //페이지 이동 replace:true 뒤로이동 방지
    navigate({ pathname: path }, { replace: true });
  };
  const moveToLogin = () => {
    //로그인 페이지로 이동
    navigate({ pathname: "/login" }, { replace: true });
  };
  const moveToLoginReturn = () => {
    // 현재 위치를 대체하며 /member/login 으로  즉시 이동
    return <Navigate replace to="/login" />;
  };
  const moveToAdminLoginReturn = () => {
    // 현재 위치를 대체하며 /admin/login 으로  즉시 이동
    return <Navigate replace to="/admin/login" />;
  };
  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    moveToAdminLoginReturn,
  };
};

export default useCustomLogin;
