import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
//
import { listTables, readReservation, seatReservation } from "../utils/api";

function SeatReservation() {
  // Hooks / state
  const history = useHistory();
  const { reservationId } = useParams();

  const [selectedTable, setSelectedTable] = useState();
  const [reservation, setReservation] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // useEffect()
  useEffect(loadTables, []); // tables = type Array
  useEffect(loadReservation, [reservationId]); //

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation({ reservationId }, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }
  ////

  const tableSelectOptions = tables.map((table) => {
    return (
      <option value={table.table_name} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  function handleSubmit(event) {
    event.preventDefault();
    setApiError(null);
    seatReservation({ selectedTable })
      .then(() =>
        history.push(`/dashboard?date=${reservation.reservation_date}`)
      )
      .catch(setApiError);
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

      {/* API tables error alert */}
      <ErrorAlert error={tablesError} />

      {/* API reservations error alert */}
      <ErrorAlert error={reservationError} />

      {/* API reservations error alert */}
      <ErrorAlert error={apiError} />

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
            <label for="table_id" className="formLabel">
              <h4>Select Table</h4>
            </label>
            <select
              className="form-control mb-2"
              name="table_id"
              id="table_id"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">--Please choose an option--</option>
              {tableSelectOptions}
            </select>

            <button type="submit" className="btn btn-primary mr-1">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SeatReservation;
