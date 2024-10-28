import { http } from "../constants/config";

export const URL_GET_ALL_TYPE_ROOM = "rank/admin";
export const URL_GET_ALL_BED = "rank/bed";
export const URL_GET_ALL_AMENITY = "rank/amenity";
export const URL_ADD_TYPE_ROOM = "rank/";
export const URL_GET_ALL_ROOM = "room/";

const adminApi = {
  //! Hạng phòng
  getAllTypeRoom: function (accessToken) {
    return http.get(URL_GET_ALL_TYPE_ROOM, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addTypeRoom: function (accessToken, formData) {
    return http.post(URL_ADD_TYPE_ROOM, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getAllBed: function (accessToken) {
    return http.get(URL_GET_ALL_BED, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getAllAmenity: function (accessToken) {
    return http.get(URL_GET_ALL_AMENITY, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Phòng
  getAllRoom: function (accessToken) {
    return http.get(URL_GET_ALL_ROOM, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default adminApi;
