import { LOGOUT } from "../redux/actions/authActions";
import store from "../redux/store";

export const authorizedFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    store.dispatch({ type: LOGOUT });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("La tua sessione è scaduta. Per favore, effettua nuovamente il login.");
    window.location.href = "/";

    throw new Error("Sessione scaduta.");
  }

  return response;
};
