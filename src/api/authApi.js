import { http } from "../constants/config";

export const URL_LOGIN = "auth/login";
export const URL_REGISTER = "auth/register";
export const URL_CHANGE_PASSWORD = "auth/password";
export const URL_FORGOT_PASSWORD = "user/check_email";

const authApi = {
  register: function (email, password) {
    const body = {
      email: email,
      password: password,
    };
    return http.post(URL_REGISTER, body); // Thêm body vào đây
  },
  login: function (email, password) {
    // Tạo đối tượng body với email và password
    const body = {
      email: email,
      password: password,
    };
    return http.post(URL_LOGIN, body); // Gửi body vào đây
  },
  changePassword: function (
    accessToken,
    email,
    password,
    newPassword,
    newPasswordConfirm
  ) {
    // Tạo đối tượng body với email và password
    const body = {
      email: email,
      password: password,
      newPassword: newPassword,
      newPasswordConfirm: newPasswordConfirm,
    };
    return http.post(URL_CHANGE_PASSWORD, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }); // Gửi body vào đây
  },
  forgotPassword: function (params) {
    // Destructure parameters
    const { email } = params;

    // Create an object for query parameters, only including defined values
    const queryParams = {};
    if (email !== undefined) queryParams.email = email;
    const queryString = new URLSearchParams(queryParams).toString();

    // Make the POST request with the constructed query string
    return http.get(`${URL_FORGOT_PASSWORD}?${queryString}`, null);
  },
};

export default authApi;
