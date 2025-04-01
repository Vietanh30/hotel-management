export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem("access_token", access_token);
};
export const setPaymentIdToLS = (paymentId) => {
  localStorage.setItem("paymentId", paymentId);
};
export const setBookingIdToLS = (bookingId) => {
  localStorage.setItem("bookingId", bookingId);
};
export const getBookingIdToLS = () => {
  return localStorage.getItem("bookingId"); // or whatever key you used
};
export const removeBookingIdToLS = () => {
  localStorage.removeItem("bookingId");
};
export const setRoleTokenToLS = (role) => {
  localStorage.setItem("role", role);
};
export const getRoleFromLS = () => {
  return localStorage.getItem("role") || "";
};
export const getPaymentIdToLS = () => {
  return localStorage.getItem("paymentId") || "";
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
