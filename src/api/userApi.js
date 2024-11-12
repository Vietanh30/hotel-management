import { http } from "../constants/config";
//! TypeRoom
export const URL_GET_ALL_TYPE_ROOM = "rank";
export const URL_GET_ALL_SERVICE = "service_hotel/category/get-service";
export const URL_GET_ROOM_BY_ID = "room/getByRank";
//! Giỏ hàng
export const URL_ADD_ROOM_TO_CART = "user/add_cart";
export const URL_GET_CART = "book/get_cart";
export const URL_REMOVE_CART = "book/remove_cart";
export const URL_EDIT_CART = "book/edit_cart";
export const URL_GET_CHECKOUT = "book/checkout";
export const URL_BOOKING_ROOM = "user/payment";
export const URL_BOOKING_HISTORY = "user/history";
export const URL_STATUS_BOOKING = "book/check_bill";
const userApi = {
  getAllTypeRoom: function () {
    return http.get(URL_GET_ALL_TYPE_ROOM);
  },
  getAllService: function () {
    return http.get(URL_GET_ALL_SERVICE);
  },
  getRoomById: function (idTypeRoom, startDate, endDate) {
    return http.get(
      `${URL_GET_ROOM_BY_ID}/${idTypeRoom}?startDate=${startDate}&endDate=${endDate}`
    );
  },
  searchRoom: function (startDate, endDate, numberRoom) {
    console.log(startDate, endDate);
    return http.get(
      `${URL_GET_ALL_TYPE_ROOM}?startDate=${startDate}&endDate=${endDate}&numberRoom=${numberRoom}`
    );
  },
  addRoomToCart: function (accessToken, body) {
    return http.post(URL_ADD_ROOM_TO_CART, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  getCart: function (accessToken) {
    return http.get(URL_GET_CART, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  removeCartItem: function (accessToken, idCartItem) {
    return http.get(`${URL_REMOVE_CART}/${idCartItem}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  editCartItem: function (accessToken, params) {
    // Destructure parameters
    const { adult, child, infant, serviceId, bookingRoomId } = params;

    // Create an object for query parameters, only including defined values
    const queryParams = {};
    if (adult !== undefined) queryParams.adult = adult;
    if (child !== undefined) queryParams.child = child;
    if (infant !== undefined) queryParams.infant = infant;
    if (serviceId != undefined) queryParams.serviceId = serviceId; // Assuming serviceId can be an empty string
    if (bookingRoomId) queryParams.bookingRoomId = bookingRoomId;

    // Convert the query parameters object to a URL query string
    const queryString = new URLSearchParams(queryParams).toString();

    // Make the POST request with the constructed query string
    return http.post(`${URL_EDIT_CART}?${queryString}`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! checkout
  getCheckout: function (accessToken) {
    return http.get(URL_GET_CHECKOUT, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  bookingRoom: function (accessToken) {
    return http.get(URL_BOOKING_ROOM, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  //! Lịch sử đặt phòng
  getBookingHistory: function (accessToken) {
    return http.get(URL_BOOKING_HISTORY, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  statusBookingRoom: function (accessToken, body) {
    console.log(body);
    return http.post(URL_STATUS_BOOKING, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
export default userApi;
