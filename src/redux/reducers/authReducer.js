import { jwtDecode } from "jwt-decode";
import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/authActions";

const token = localStorage.getItem("token");
const userString = localStorage.getItem("user");
let initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  error: null,
};

if (token && userString) {
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 > Date.now()) {
      initialState = {
        token: token,
        isAuthenticated: true,
        user: JSON.parse(userString),
        error: null,
      };
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (e) {
    console.error("Dati di sessione non validi", e);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("user", JSON.stringify(payload.user));
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
        user: payload.user,
        error: null,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: payload ? payload.error : null,
      };
    default:
      return state;
  }
};
