import axios from "axios";
import { setTrainerData } from "../redux/actions/trainerActions";
import { setTrainer } from "../redux/actions/authActions";
import store from "../redux/store";

const getIP = () => {
    const states = store.getState();
    const ip = states.auth.IP;
    return ip;
};

const API_URL = `${getIP()}/trainer`;

export const getTrainer = (token, trainerId, dispatch) => {
    console.log("getting trainer");

    const fetchTrainerData = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-trainer?trainerId=${trainerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                let trainer = response.data.trainer;
                dispatch(setTrainer(trainer));
            } else {
                console.log("Error in fetching trainer data");
            }
        } catch (err) {
            console.log(err);
        }
    };

    fetchTrainerData();
};

export const handleTrainerLogin = async (token, formData) => {
    try {
        const response = await axios.post(
            `${API_URL}/trainer-login`,
            { formData },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const handleGetTrainerData = async (token, trainerId, dispatch) => {
    console.log("getting trainer data");
    try {
        const response = await axios.get(`${API_URL}/trainer-data?trainerId=${trainerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            let trainerData = response.data.trainer;
            dispatch(setTrainerData(trainerData));
        } else {
            dispatch(setTrainerData([]));
        }
    } catch (err) {
        console.log(err);
    }
};

export const handleMarkAsComplete = async (token, programId, trainerId, taskId, dispatch) => {
    try {
        const response = await axios.post(
            `${API_URL}/mark-task-completed`,
            { programId, trainerId, taskId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await handleGetTrainerData(token, trainerId, dispatch);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export const markAttendance = async (token, trainerId, attendanceData, dispatch) => {
    try {
        const response = await axios.post(
            `${API_URL}/mark-attendance`,
            { trainerId, attendanceData },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status == 200) {
            await handleGetTrainerData(token, trainerId, dispatch);
            getTrainer(token, trainerId, dispatch);
            return response.data;
        } else {
            return response.data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const resetPasswordHandle = async (token, email, oldPassword, newPassword, trainerId, dispatch) => {
    console.log(email, oldPassword, newPassword, trainerId);
    try {
        const response = await axios.post(
            `${API_URL}/reset-password`,
            { email, newPassword, trainerId, oldPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status == 200) {
            getTrainer(token, trainerId, dispatch);
            handleGetTrainerData(token, trainerId, dispatch);
            return response.data;
        } else {
            return response.data;
        }
    } catch (err) {
        console.log(err);
    }
};
