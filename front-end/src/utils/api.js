/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
// "http://localhost:5001/reservations?mobile_number=123456" 
*/

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */

export async function listTables(signal, params) {
  const url = new URL(`${API_BASE_URL}/tables`);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );
  }
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Sends data representing new reservation to be stored by API in database.
 * @returns
 *
 */

export async function createReservation(params) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(url, { headers, method: "POST", body: jsonData }, []);
}

/**
 * Sends data representing new table to be stored by API in database.
 * @returns
 *
 */

export async function createTable(params) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(url, { headers, method: "POST", body: jsonData }, []);
}

/**
 * Sends data representing reservation to be updated by API in database.
 * @returns
 *
 */

export async function seatReservation(params, table_id) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(url, { headers, method: "PUT", body: jsonData }, []);
}

/**
 * Retrieves a single reservation based on the reservation_id passed.
 * @returns
 *
 */

export async function readReservation(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Sends request to update database with "finished" / "null" in the "reservations" and "tables" tables, respectively.
 * @returns
 *
 */

export async function finishTable(params, table_id) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(
    url,
    { headers, method: "DELETE", body: jsonData },
    []
  );
}
// { reservation_id: table.reservation_id }, table.table_id

/**
 * Sends request to update database with provided status string in the "reservations" table.
 * @returns
 *
 */

export async function updateReservationStatus(params, reservation_id) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(url, { headers, method: "PUT", body: jsonData }, []);
}

/**
 * Sends request to update database with provided properties in the "reservations" table.
 * @returns
 *
 */

export async function updateReservation(params, reservation_id) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  const jsonData = JSON.stringify({ data: params });
  return await fetchJson(url, { headers, method: "PUT", body: jsonData }, []);
}
