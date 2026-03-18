import { getOne } from "../../api/BusinessApi";
import "./MainComponent.css";
import { API_SERVER_HOST } from "../../api/BusinessApi";
import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
  no: 0,
  title: "",
  price: 0,
  category: "",
  content: "",
  writer: "",
  sign: "",
  regDate: null,
  endDate: null,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ReadComponent = ({ no }) => {
  const [businessBoard, setBusinessBoard] = useState(initState);
  const { moveToBusinessBoardList, moveToBusinessBoardModify } =
    useCustomMove();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFetching(true);
    }, 0);

    getOne(no)
      .then((data) => {
        setBusinessBoard(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
    clearTimeout(timer);
  }, [no]);

  return <div className="read-container">Read Component</div>;
};
export default ReadComponent;
