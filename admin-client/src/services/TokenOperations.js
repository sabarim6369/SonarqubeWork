import axios from "axios";
import store from "../redux/store"

const getIP = () => {
  const states = store.getState()
  const ip = states.auth.IP
  return ip
}

const API_URL = `${getIP()}/token`;

export const checkTokenIsValid = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/checktokenvalid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 && response.data) {
      console.log("Token is valid:", response.data);
      return response.data;
    } else {
      console.log("Invalid token");
      return { success: false };
    }
  } catch (error) {
    console.error("Error checking token validity:", error.message || error);
    return error.response
      ? error.response.data
      : { message: "Error checking token validity" };
  }
};

