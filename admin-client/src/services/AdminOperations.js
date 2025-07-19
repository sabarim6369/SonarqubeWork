import axios from "axios";
import { setAdmin } from "../redux/actions/authActions";
import {
  setColleges,
  setProblems,
  setPrograms,
  setTrainers,
} from "../redux/actions/adminActions";
import store from "../redux/store";

const getIP = () => {
  const states = store.getState();
  const ip = states.auth.IP;
  return ip;
};

const API_URL = `${getIP()}/admin`;
console.log(API_URL);

export const getAdmin = async (token, adminId, dispatch) => {
  if (!adminId) {
    console.error("Admin ID is not available.");
    return;
  }

  try {
    const response = await axios.get(
      `${API_URL}/get-admin?adminId=${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data.admin;
      dispatch(setAdmin(data));
    } else {
      console.error(response.data.message);
    }
  } catch (err) {
    console.error("Error fetching admin details:", err.message || err);
  }
};

export const deleteAdmin = async (adminId, token, dispatch) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete-admin?adminId=${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    console.error("Error deleting admin:", err.message || err);
  }
};

export const getAdmins = async (token, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/get-admins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data.admins;
    }
  } catch (err) {
    console.error("Error fetching admins:", err.message || err);
  }
};

export const adminSignup = async (signupData, token) => {
  try {
    const response = await axios.post(`${API_URL}/admin-signup`, signupData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error(
      "Signup error:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again later.",
    };
  }
};

export const adminSignin = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/admin-signin`, loginData);
    console.log(response);
    if (response.status === 200) {
      localStorage.setItem("Token", response.data.token);
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.error(
      "Signin error:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again later.",
    };
  }
};

export const handleAddTrainer = async (token, formData) => {
  try {
    const response = await axios.post(`${API_URL}/add-trainer`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding trainer:", error);
    return { error: "An error occurred. Please try again." };
  }
};

export const getAllTrainers = async (token, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/get-all-trainers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      dispatch(setTrainers(response.data.trainers));
    } else {
      dispatch(setTrainers([]));
      throw new Error("Failed to fetch trainers");
    }
  } catch (error) {
    console.error("Error fetching trainers:", error.message);
    return { error: error.message || "An unknown error occurred" };
  }
};

export const editTrainer = async (token, trainerId, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit-trainer`,
      { trainerId, formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error editing trainer:", err.message);
  }
};

export const deleteTrainer = async (token, trainerId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete-trainer?trainerId=${trainerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error deleting trainer:", err.message);
  }
};

export const addProgram = async (token, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-program`,
      { formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error adding program:", err.message);
  }
};

export const getAllPrograms = async (token, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/get-all-programs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      let programs = response.data.programs;
      dispatch(setPrograms(programs));
    } else {
      dispatch(setPrograms([null]));
    }
  } catch (err) {
    console.error("Error getting all programs:", err.message);
  }
};

export const deleteTask = async (token, programId, taskId, dispatch) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete-task?programId=${programId}&taskId=${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllPrograms(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error deleting task:", err.message);
  }
};

export const addTask = async (token, programId, newTaskList, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-task`,
      { programId, newTaskList },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllPrograms(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error adding task:", err.message);
  }
};

export const handleProgramEdit = async (
  token,
  programId,
  changes,
  dispatch
) => {
  try {
    const response = await axios.post(
      `${API_URL}/edit-program`,
      { programId, changes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllPrograms(token, dispatch);
      await getAllTrainers(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error editing program:", err.message);
  }
};

export const handleDelete = async (token, programId, dispatch) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-program`, {
      data: { programId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      await getAllPrograms(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error deleting program:", err.message);
  }
};

export const getAllColleges = async (token, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/get-all-colleges`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      dispatch(setColleges(response.data.colleges));
    } else {
      dispatch(setColleges([]));
      throw new Error("Failed to fetch Colleges");
    }
  } catch (error) {
    console.error("Error fetching trainers:", error.message);
    return { error: error.message || "An unknown error occurred" };
  }
};

export const deleteCollege = async (collegeId, token, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-college`,
      {
        collegeId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      getAllColleges(token, dispatch);
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleAddCollege = async (token, formData) => {
  try {
    const response = await axios.post(`${API_URL}/add-college`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding college:", error);

    const errorMessage =
      error.response?.data?.message || "An error occurred. Please try again.";

    return { success: false, message: errorMessage };
  }
};

export const handleTrainerPassReset = async (trainerId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-trainer-password`,
      { trainerId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error resetting trainer password:", error);
    return { error: "An error occurred. Please try again." };
  }
};

export const getAllProblems = async (token, dispatch) => {
  console.log("Fetching all problems...");
  try {
    const response = await axios.get(`${API_URL}/get-all-problems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const problems = response.data.problems;
      console.log(problems);
      dispatch(setProblems(problems));
      return response.data;
    } else {
      console.error("Failed to fetch problems:", response.data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching all problems:", err.message);
    return [];
  }
};

export const handleAddProblem = async (token, problem, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-problem`,
      { problem },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      await getAllPrograms(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error adding all program manual tasks:", err.message);
  }
};

export const handleAddCategory = async (categoryName, token, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-category`,
      { categoryName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      await getAllProblems(token, dispatch);
      return {
        success: true,
        category: response.data.category,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create category",
      };
    }
  } catch (err) {
    console.error("Error creating category:", err.message);
    return {
      success: false,
      message: err.message || "An error occurred while creating category",
    };
  }
};

export const handleDeleteCategory = async (token, categoryId, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-category`,
      {
        categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllProblems(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error deleting category:", err.message);
    return { success: false, message: err.message };
  }
};

export const handleDeleteProblem = async (
  token,
  problemId,
  categoryId,
  dispatch
) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-problem`,
      {
        problemId,
        categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllProblems(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error deleting problem:", err.message);
    return { success: false, message: err.message };
  }
};

export const handleEditProblem = async (
  token,
  problemId, 
  updates,
  dispatch
) => {
  try {
    const response = await axios.post(
      `${API_URL}/edit-problem`,
      {
        problemId,
        updates,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await getAllProblems(token, dispatch);
      return response.data;
    }
  } catch (err) {
    console.error("Error editing problem:", err.message);
    return { success: false, message: err.message };
  }
};
