import axios from "axios";
import { returnErrors } from "./errorActions";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_UPDATING,
  USER_UPDATED,
  RESET_USER_UPDATE_FORM,
  USER_UPDATE_FAIL
} from "./actionTypes";

export const updateUser = ({id, name, email}) => (dispatch, getState) => {
  dispatch({
    type: USER_UPDATING
  })

  const body = JSON.stringify({ name, email })

  axios.post(`/api/users/${id}`, body, tokenConfig(getState)).then((res)=>{
    dispatch({
      type: USER_UPDATED,
      payload: res.data
    })
    setTimeout(()=>{
      dispatch({
        type: RESET_USER_UPDATE_FORM
      })
    }, 3000)
  }).catch(err =>{
    dispatch(returnErrors(err.response.data, err.response.status, USER_UPDATE_FAIL));
    dispatch({
      type: USER_UPDATE_FAIL
    })
    
  })
}

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const register = ({ name, email, password }) => dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  axios
    .post("/api/users", body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, REGISTER_FAIL)
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth", body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, LOGIN_FAIL)
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT_SUCCESS
  });
};

export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
