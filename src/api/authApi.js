import { http } from "../constants/config";

export const URL_LOGIN = "auth/login";
export const URL_REGISTER = "auth/register";

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
};

export default authApi;
