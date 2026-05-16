export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";

};

export const getToken = () => {

  return localStorage.getItem("token");

};