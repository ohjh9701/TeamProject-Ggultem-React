/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../pages/Loading";

const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Business = lazy(() => import("../pages/Business/MainPage"));
const KakaoRedirect = lazy(() => import("../pages/KakaoRedirectPage")); // 경로 확인!
//* 마이페이지 lazy */
const MyPage = lazy(() => import("../pages/MyPage/MyPage"));
const Modify = lazy(() => import("../pages/MyPage/ModifyPage"));
const root = createBrowserRouter([
  /* ===== 메인페이지 연결 영역 ===== */
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Main />
      </Suspense>
    ),
  },
  /* ===== 로그인 페이지 연결 영역 ===== */
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "member",
    children: [
      {
        path: "kakao",
        element: (
          <Suspense fallback={<Loading />}>
            <KakaoRedirect />
          </Suspense>
        ),
      },
    ],
  },
  /* ===== 마이페이지 연결 영역 ===== */
  {
    path: "/mypage/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: "/mypage/modify/:email",
    element: (
      <Suspense fallback={<Loading />}>
        <Modify />
      </Suspense>
    ),
  },
  /* ===== 비즈니스 연결 영역 ===== */
  {
    path: "/business",
    element: (
      <Suspense fallback={<Loading />}>
        <Business />
      </Suspense>
    ),
  },
]);

export default root;
