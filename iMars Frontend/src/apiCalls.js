import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({
        type: "LOGIN_START"
    });

    try {
        const res = await axios.post("/login", userCredentials);
        dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: err
        })
    }
}

export const updateCall = async (userCredentials, dispatch) => {
    try {
        const res = await axios.post("/users", userCredentials);
        dispatch({
            type: "UPDATE_USER",
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: "UPDATE_USER_FAILURE",
            payload: err
        })
    }
}


export const logoutCall = async (dispatch) => {
    try {
        await axios.post("/logout");

        dispatch({
            type: "LOGOUT"
        })
    } catch (err) {
        dispatch({
            type: "LOGOUT_FAILURE",
            payload: err
        })
    }
}

export const deleteUserCall = async (dispatch) => {
    try {
        await axios.delete("/users");

        dispatch({
            type: "DELETE_USER"
        })
    } catch (err) {
        dispatch({
            type: "DELETE_USER_FAILURE",
            payload: err
        })
    }
}