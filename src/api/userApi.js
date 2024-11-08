import { http } from "../constants/config";
//! TypeRoom
export const URL_GET_ALL_TYPE_ROOM = "rank";
export const URL_GET_ALL_SERVICE = "service_hotel/category/get-service";
export const URL_GET_ROOM_BY_ID = "room/getByRank";

const userApi = {
  getAllTypeRoom: function () {
    return http.get(URL_GET_ALL_TYPE_ROOM);
  },
  getAllService: function () {
    return http.get(URL_GET_ALL_SERVICE);
  },
  getRoomById: function (idTypeRoom) {
    return http.get(`${URL_GET_ROOM_BY_ID}/${idTypeRoom}`);
  },
  searchRoom: function (startDate, endDate, numberRoom) {
    console.log(startDate, endDate);
    return http.get(
      `${URL_GET_ALL_TYPE_ROOM}?startDate=${startDate}&endDate=${endDate}&numberRoom=${numberRoom}`
    );
  },
};
export default userApi;
