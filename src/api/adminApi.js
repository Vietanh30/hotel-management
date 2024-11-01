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
//!NumberRoom
export const URL_GET_ALL_NUMBEROOM = "room/admin/room_number/all";
export const URL_GET_NUMBEROOM_NO_BOOKED = "room/admin/room_number/get";
export const URL_ADD_NUMBEROOM = "room/admin/room_number/create";
export const URL_EDIT_NUMBEROOM = "room/admin/room_number/edit";
export const URL_ACTIVE_NUMBEROOM = "room/admin/room_number/remove_room";
//!Room
export const URL_GET_ALL_ROOM = "room/admin/getAll";
export const URL_ADD_ROOM = "room/create";
export const URL_EDIT_ROOM = "room/edit";
export const URL_ACTIVE_ROOM = "admin/active";
export const URL_GET_ALL_SERVICE_ROOM = "room/admin/room_service/all";

//!Staff
export const URL_GET_ALL_STAFF = "admin/user";
export const URL_ADD_STAFF = "admin/user/create";
export const URL_EDIT_STAFF = "admin/user/edit";
export const URL_ACTIVE_STAFF = "admin/active";
//!Customer
export const URL_GET_ALL_CUSTOMER = "admin/customer";
export const URL_ADD_CUSTOMER = "admin/customer/create";
export const URL_EDIT_CUSTOMER = "admin/customer/edit";
export const URL_ACTIVE_CUSTOMER = "admin/active";
//! Chính sách
export const URL_GET_ALL_POLICY = "room/admin/policy_type/getAll";

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
  //! NumberRoom
  getAllNumberRoom: function (accessToken) {
    return http.get(URL_GET_ALL_NUMBEROOM, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getNumberRoomNoBooked: function (accessToken) {
    return http.get(URL_GET_NUMBEROOM_NO_BOOKED, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addNumberRoom: function (accessToken, body) {
    return http.post(URL_ADD_NUMBEROOM, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  editNumberRoom: function (accessToken, body) {
    return http.put(URL_EDIT_NUMBEROOM, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  activeNumberRoom: function (idNumberRoom, accessToken) {
    return http.get(`${URL_ACTIVE_NUMBEROOM}/${idNumberRoom}`, {
      headers: {
        "Content-Type": "application/json",
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
  addRoom: function (accessToken, body) {
    return http.post(URL_ADD_ROOM, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  editRoom: function (accessToken, body) {
    return http.put(URL_EDIT_ROOM, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  activeRoom: function (idRoom, accessToken) {
    return http.get(`${URL_ACTIVE_ROOM}/${idRoom}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getAllServiceRoom: function (accessToken) {
    return http.get(URL_GET_ALL_SERVICE_ROOM, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Chính sách
  getAllPolicy: function (accessToken) {
    return http.get(URL_GET_ALL_POLICY, {
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
  activeService: function (idService, accessToken) {
    return http.get(`${URL_ACTIVE_SERVICE}/${idService}`, {
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
  //! Staff
  getAllStaff: function (accessToken) {
    return http.get(URL_GET_ALL_STAFF, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addStaff: function (accessToken, body) {
    return http.post(URL_ADD_STAFF, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  editStaff: function (accessToken, body) {
    return http.put(URL_EDIT_STAFF, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  activeStaff: function (idStaff, accessToken) {
    return http.get(`${URL_ACTIVE_STAFF}/${idStaff}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Customer
  getAllCustomer: function (accessToken) {
    return http.get(URL_GET_ALL_CUSTOMER, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  addCustomer: function (accessToken, body) {
    return http.post(URL_ADD_CUSTOMER, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  editCustomer: function (accessToken, body) {
    return http.put(URL_EDIT_CUSTOMER, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  activeCustomer: function (idCustomer, accessToken) {
    return http.get(`${URL_ACTIVE_CUSTOMER}/${idCustomer}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default adminApi;
