import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" }); 
export const uploadImage = (file, languages) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, { params: { languages } });
};

export const getStatus = (jobId) => api.get(`/jobs/${jobId}/status`);

export const getResult = (jobId) => api.get(`/jobs/${jobId}/result`);

export const submitReview = (jobId, decisions) => api.post(`/review/${jobId}`, { decisions });
