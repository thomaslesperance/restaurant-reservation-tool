import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
//
import { readReservation, listTables, seatReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";

function SeatReservation() {
  console.log("top of SeatReservation");

  //Hooks
  const history = useHistory();
  const { reservationId } = useParams();

  //State
  const [isLoading, setIsLoading] = useState(false);
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [apiError, setApiError] = useState(null);
  const [clientError, setClientError] = useState(null);

  //useEffect
  useEffect(loadTables, []); // tables = type Array
  useEffect(loadReservation, [reservationId]); // reservation = type Object

  function loadReservation() {
    console.log("loadReservation");
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    readReservation({ reservation_id: reservationId }, abortController.signal)
      .then((response) => {
        formatReservationDate(response);
        formatReservationTime(response);
        setReservation(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  function loadTables() {
    console.log("loadTables");
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then((response) => {
        setTables(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }
  ////

  //List for rendering
  const tableSelectOptions = tables.map((table) => {
    return (
      <option value={table.table_id} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  function handleChange({ target }) {
    // Do not seat a reservation with more people than the capacity of the table
    // const reservationSize
    // const selectedTableCapacity
    // setSelectedTableId(e.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    setApiError(null);
    seatReservation(
      { reservation_id: reservation.reservation_id },
      selectedTableId
    )
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setApiError);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Seat Reservation</h1>

      <div className="row m-1">
        <ol className="breadcrumb border w-100">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Seat Reservation</li>
        </ol>
      </div>

      {/* API error alert */}
      <ErrorAlert error={apiError} />

      {/* Client error alert */}
      <ErrorAlert error={clientError} />

      <h4>Reservation</h4>
      <div className="row m-1 card">
        <div className="card-body">
          <h5 className="card-title">
            {reservation.first_name} {reservation.last_name}
          </h5>

          <p className="card-text">
            Mobile Number: {reservation.mobile_number}
          </p>
          <p className="card-text">
            Reservation Date: {reservation.reservation_date}
          </p>
          <p className="card-text">
            Reservation Time: {reservation.reservation_time}
          </p>
          <p className="card-text">Party Size: {reservation.people}</p>
          <p className="card-text">Created At: {reservation.created_at}</p>
          <p className="card-text">Last Updated: {reservation.updated_at}</p>
          <h6 className="card-text">
            Reservation ID: {reservation.reservation_id}
          </h6>
        </div>
      </div>

      <div className="row m-1 card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label htmlFor="table_id" className="formLabel">
              <h4>Select Table</h4>
              <h6>Table Name - Table Capacity</h6>
            </label>
            <select
              className="form-control mb-2"
              name="table_id"
              id="table_id"
              value={selectedTableId}
              onChange={handleChange}
            >
              <option value="">--Please choose an option--</option>
              {tableSelectOptions}
            </select>

            <button type="submit" className="btn btn-primary mr-1">
              Submit
            </button>

            <button
              type="button"
              className="btn btn-secondary mr-1"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SeatReservation;
