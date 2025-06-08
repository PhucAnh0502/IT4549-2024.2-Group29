import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH;

export const fetchUserInfo = async () => {
  let userInfo;
  try {
    const response = await axios.get(`${API_PATH}/User/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      userInfo = response.data;
    }
  } catch (err) {
    if (err.response.data.message) {
      alert(err.response.data.message);
    }
  }
  return userInfo;
};

export const getAllAccounts = async () => {
  let accounts;
  try {
    const response = await axios.get(`${API_PATH}/User/all-account`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      accounts = response.data;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return accounts;
};

export const getAllUsers = async () => {
  let users;
  try {
    const response = await axios.get(`${API_PATH}/User/all-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      users = response.data;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return users;
};
