import HttpStatusCode from "../constants/httpStatusCode";

export function isAxiosError(error) {
  return error.isAxiosError === true;
}

export function isAxiosUnprocessableEntityError(error) {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  );
}

export function isAxiosUnauthorizedError(error) {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  );
}

export function isAxiosExpiredTokenError(error) {
  return (
    isAxiosUnauthorizedError(error) &&
    error.response?.data?.message === "Access token is invalid"
  );
}
const removeSpecialCharacter = (str) =>
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ""
  );

export const generateNameId = ({ name, id }) => {
  return removeSpecialCharacter(name).replace(/\s/g, "-") + `-i-${id}`;
};

export const getIdFromNameId = (nameId) => {
  const arr = nameId.split("-i-");
  return arr[arr.length - 1];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const formatPrice = (price) => {
  // console.log(price)
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};
// Hàm chuyển đổi giá trị thời gian từ định dạng "HH:MM" thành phút
export const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
export const formatDateToYYYYMMDD = (dateString) => {
  const date = new Date(dateString);

  // Lấy năm, tháng, ngày từ đối tượng Date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
  const day = String(date.getDate()).padStart(2, "0");

  // Trả về chuỗi theo định dạng "yyyy-MM-dd"
  return `${year}-${month}-${day}`;
};
