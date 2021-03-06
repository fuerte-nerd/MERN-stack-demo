import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  USER_UPDATING,
  USER_UPDATED,
  REGISTER_FAIL,
  RESET_USER_UPDATE_FORM,
  USER_UPDATE_FAIL
} from "../actionTypes";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  isUpdating: false,
  isUpdated: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: {
          ...action.payload,
          id: action.payload._id
        }
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case USER_UPDATING:
      return {
        ...state,
        isUpdated: false,
        isUpdating: true
      };
    case USER_UPDATED:
      return {
        ...state,
        isUpdating: false,
        isUpdated: true,
        user: {
          ...action.payload,
          id: action.payload._id
        }
      };
    case RESET_USER_UPDATE_FORM:
    case USER_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        isUpdated: false
      };

    default:
      return state;
  }
}
