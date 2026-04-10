import axios from "axios";
import { API_SERVER_HOST } from "./config";
import jwtAxios from "../util/JwtUtil";

export { API_SERVER_HOST };
const prefix = `${API_SERVER_HOST}/itemBoard/reply`;

// 댓글 리스트 조회
export const getReplyList = async (id) => {
  const res = await axios.get(`${prefix}/list/${id}`);
  return res.data;
};

// 댓글 생성
export const addReply = async (reply) => {
  const res = await jwtAxios.post(`${prefix}/`, reply);
  return res.data;
};

// 댓글 수정
export const modifyReply = async (replyNo, replyObj) => {
  const res = await jwtAxios.put(`${prefix}/${replyNo}`, replyObj);
  return res.data;
};

// 댓글 삭제
export const removeReply = async (replyNo) => {
  const res = await jwtAxios.get(`${prefix}/${replyNo}`);
  return res.data;
};
