import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};
// 문자열 파라미터 처리를 위한 보조 함수
const getString = (param, defaultValue) => {
  if (!param) return defaultValue;
  return param;
};

const useCustomMove = () => {
  const navigate = useNavigate();

  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);
  const keyword = getString(queryParams.get("keyword"), "");
  const searchType = getString(queryParams.get("searchType"), "all");
  const queryDefault = createSearchParams({
    page,
    size,
    keyword,
    searchType,
  }).toString(); //새로 추가

  const [refresh, setRefresh] = useState(false);

  //********************************** BusinessBoard 영역 *************************************

  const moveToBusinessBoardList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      const keywordStr = getString(pageParam.keyword, keyword);
      const typeStr = getString(pageParam.searchType, searchType);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
        keyword: keywordStr,
        searchType: typeStr,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../business/board/list`,
      search: queryStr,
    });

    setRefresh(!refresh);
  };

  const moveToBusinessBoardRead = (no) => {
    navigate({
      pathname: `../business/board/read/${no}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  const moveToBusinessBoardModify = (no) => {
    console.log(queryDefault);
    navigate({
      pathname: `../business/board/modify/${no}`,
      search: queryDefault, //수정시에 기존의 쿼리 스트링 유지를 위해
    });
  };

  return {
    moveToBusinessBoardList,
    moveToBusinessBoardRead,
    moveToBusinessBoardModify,
    page,
    size,
    keyword,
    searchType,
    refresh,
  };
};

export default useCustomMove;
