import "./ListComponent.css";
import { getList } from "../../api/BusinessApi";
import { API_SERVER_HOST } from "../../api/BusinessApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { useEffect, useState } from "react";
import PageComponent from "../common/PageComponent";

const host = API_SERVER_HOST;

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};
