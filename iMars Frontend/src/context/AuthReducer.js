

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            };

        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                isFetching: false,
                error: false
            };

        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            };

        case "LOGOUT":
            localStorage.clear();

            return {
                user: null,
                isFetching: false,
                error: false
            };

        case "LOGOUT_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            };

        case "UPDATE_USER":
            return {
                user: action.payload,
                error: false
            };

        case "UPDATE_USER_FAILURE":
            return {
                isFetching: false,
                error: action.payload
            };

        case "DELETE_USER":
            localStorage.clear();

            return {
                user: null,
                error: false
            };

        case "DELETE_USER_FAILURE":
            return {
                error: action.payload
            };

        default:
            return state;
    }
};

export default AuthReducer;
