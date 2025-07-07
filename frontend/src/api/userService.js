import axios from "axios";

const BASE_URL = "/api";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    await axios.post(`${BASE_URL}/users`, userData);
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
