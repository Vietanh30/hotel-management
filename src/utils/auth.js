export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem("access_token", access_token);
};
export const setRoleTokenToLS = (role) => {
  localStorage.setItem("role", role);
};
export const getRoleFromLS = () => {
  return localStorage.getItem("role") || "";
};
export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  // localStorage.removeItem("profile");
  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessTokenFromLS = () => {
  return localStorage.getItem("access_token") || "";
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
