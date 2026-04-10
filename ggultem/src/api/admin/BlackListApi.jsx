import axios from "axios";
import { API_SERVER_HOST } from "../config";
export { API_SERVER_HOST };
import jwtAxios from "../../util/JwtUtil";

const prefix = `${API_SERVER_HOST}/api/admin/blacklist`;

export const checkMemberByEmail = async (email) => {
  const res = await jwtAxios.get(`${prefix}/check-email`, {
    params: { email: email },
  });
  return res.data;
};

// 💡 수정: keyword와 searchType을 params에 추가
export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;
  const res = await jwtAxios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};

export const postAdd = async (blackListObj) => {
  const res = await jwtAxios.post(`${prefix}/`, blackListObj);
  return res.data;
};

export const getOne = async (blId) => {
  const res = await jwtAxios.get(`${prefix}/${blId}`);
  return res.data;
};

export const putOne = async (blackListObj) => {
  const res = await jwtAxios.put(`${prefix}/${blackListObj.blId}`, blackListObj);
  return res.data;
};

export const deleteOne = async (blId) => {
  const res = await jwtAxios.delete(`${prefix}/${blId}`);
  return res.data;
};
