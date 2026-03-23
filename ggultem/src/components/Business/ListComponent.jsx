import { useEffect, useState } from "react";
import { getList, API_SERVER_HOST } from "../../api/admin/MemberApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import { useNavigate } from "react-router-dom";
import "./ListComponent.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const host = API_SERVER_HOST;

const ListComponent = () => {
  const { page, size, keyword, searchType, refresh, moveToBoardList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    getList({ page, size, keyword, searchType }).then((data) => {
      setServerData(data);
    });
  }, [page, size, keyword, searchType, refresh]);

  return <div>리스트 화면</div>;
};

export default ListComponent;
