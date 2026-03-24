import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/board`;

export const getOne = async (boardNo) => {
  const res = await axios.get(`${prefix}/${boardNo}`);
  return res.data;
};

// 등록
export const addBoard = async (boardObj) => {
  const formData = new FormData();

  formData.append("title", boardObj.title);
  formData.append("content", boardObj.content);
  formData.append("email", boardObj.email);

  const res = await axios.post(`${prefix}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// 수정
export const modifyBoard = async (boardNo, boardObj) => {

  const formData = new FormData();

  formData.append("title", boardObj.title);
  formData.append("content", boardObj.content);

  const res = await axios.put(`${prefix}/${boardNo}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const removeBoard = async (boardNo) => {

  const res = await axios.put(`${prefix}/remove/${boardNo}`);

  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size, keyword, searchType } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: {
      page: page,
      size: size,
      keyword: keyword,
      searchType: searchType,
    },
  });
  return res.data;
};
