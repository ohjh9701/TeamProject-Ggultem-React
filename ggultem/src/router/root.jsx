/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../pages/Loading";

const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Business = lazy(() => import("../pages/Business/MainPage"));
const KakaoRedirect = lazy(() => import("../pages/KakaoRedirectPage")); // 경로 확인!
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
