import axios, { AxiosResponse } from "axios";
import { Node } from "../interfaces/node";

const API_URL = "http://localhost:3000/api/nodes";

export const addNode = (data: {
  name: string;
  parentId: string;
}): Promise<AxiosResponse<Node>> => {
  return axios.post(`${API_URL}`, data);
};
