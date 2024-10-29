import { http } from "../constants/config";
//! TypeRoom
export const URL_GET_ALL_TYPE_ROOM = "rank/admin";
export const URL_ADD_TYPE_ROOM = "rank/create";
export const URL_EDIT_TYPE_ROOM = "rank/edit";
export const URL_ACTIVE_TYPE_ROOM = "rank/active";
export const URL_GET_ALL_BED = "rank/bed";
export const URL_GET_ALL_AMENITY = "rank/amenity";

//! Service
export const URL_GET_ALL_SERVICE = "service_hotel";
export const URL_ADD_SERVICE = "service_hotel/create";
export const URL_EDIT_SERVICE = "service_hotel/edit";
export const URL_ACTIVE_SERVICE = "service_hotel/active";
export const URL_GET_ALL_CATEGORY = "service_hotel/category/getAll";

//!Room
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
  editTypeRoom: function (accessToken, formData) {
    return http.put(URL_EDIT_TYPE_ROOM, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  activeTypeRoom: function (idTypeRoom, accessToken) {
    return http.get(`${URL_ACTIVE_TYPE_ROOM}/${idTypeRoom}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Giường
  getAllBed: function (accessToken) {
    return http.get(URL_GET_ALL_BED, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Tiện ích
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
  //! Service

  getAllService: function (accessToken) {
    return http.get(URL_GET_ALL_SERVICE, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addService: function (accessToken, formData) {
    return http.post(URL_ADD_SERVICE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  editService: function (accessToken, formData) {
    return http.put(URL_EDIT_SERVICE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  activeService: function (idTypeRoom, accessToken) {
    return http.post(`${URL_ACTIVE_SERVICE}/${idTypeRoom}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getAllCategory: function (accessToken) {
    return http.get(URL_GET_ALL_CATEGORY, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default adminApi;
