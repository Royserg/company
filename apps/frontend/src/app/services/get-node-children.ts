import axios, { AxiosResponse } from "axios";
import { Node } from "../interfaces/node";

const API_URL = "http://localhost:3000/api/nodes";

export const getNodeChildren = (
  nodeId: string,
): Promise<AxiosResponse<Node[]>> => {
  return axios.get(`${API_URL}/${nodeId}/children`);
};
