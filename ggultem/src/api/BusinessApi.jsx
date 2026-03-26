import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}`;

//비즈니스 광고 게시글
export const postItemBoardAdd = async (formData) => {
  const res = await axios.post(`${host}/business/board/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getOne = async (no) => {
  const res = await axios.get(`${host}/business/board/${no}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;
  const res = await axios.get(`${host}/business/board/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};

//사용자 AD 노출용 리스트
export const getADSPList = async () => {
  const res = await axios.get(`${host}/business/board/adlist`);
  return res.data;
};

//사용자 AD 노출용 리스트
export const getADPLList = async () => {
  const res = await axios.get(`${host}/business/board/adpllist`);
  return res.data;
};

//광고 클릭시 조회수 증가
export const viewCountAdd = async (no) => {
  const res = await axios.put(`${host}/business/board/viewcount/${no}`);
  return res.data;
};

//비즈니스 회원 등록
export const postAdd = async (businessData) => {
  const res = await axios.post(`${host}/businessmember/`, businessData);
  return res.data;
};

//비즈니스 회원 정보
export const getMyPage = async (email) => {
  const res = await axios.get(`${host}/businessmember/${email}`);
  return res.data;
};

// 사업자 번호 인증 API 호출 함수
export const verifyBusinessApi = async (businessNumber) => {
  // 백엔드에 만든 /verify (혹은 설정한 경로) 호출
  const res = await axios.post(`${host}/businessmember/verify`, {
    businessNumber,
  });
  return res.data; // { isValid: true/false } 형태라고 가정
};
