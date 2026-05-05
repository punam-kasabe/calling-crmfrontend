import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// GET all projects
export const getProjects = async () => {
  const res = await axios.get(`${BASE_URL}/projects`);
  return res.data;
};