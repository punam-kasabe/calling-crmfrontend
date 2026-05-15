import axios from "axios";

const BASE_URL = "https://calling-crm-backend-7w52.onrender.com";
// GET all projects
export const getProjects = async () => {
  const res = await axios.get(`${BASE_URL}/projects`);
  return res.data;
};