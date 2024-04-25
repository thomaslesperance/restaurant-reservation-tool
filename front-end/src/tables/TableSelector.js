import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
import TableSelectOptions from "./TableSelectOptions";
//
import { listTables, seatReservation } from "../utils/api";
//

export default function TableSelector({ reservation }) {
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(""); //type string
  const [apiError, setApiError] = useState(null);
  const [clientError, setClientError] = useState(null);

  useEffect(loadTables, []); // tables = type Array

  function loadTables() {
    setApiError(null);
    const abortController = new AbortController();
    listTables(abortController.signal, { available: true })
      .then((response) => {
        setTables(response);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  function handleChange({ target }) {
    setClientError(null);
    const selectedTableCapacity = tables.find(
      (table) => Number(table.table_id) === Number(target.value)
    ).capacity;
    if (reservation.people > selectedTableCapacity) {
      setClientError(
        new Error("Reservation size must not exceed table capacity")
      );
    } else {
      setSelectedTableId(target.value);
    }
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

  return (
    <>
      <ErrorAlert error={clientError} />

      <div className="row m-1 card">
        <form className="card-body" onSubmit={handleSubmit}>
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
            <TableSelectOptions tables={tables} />
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
        <ErrorAlert error={apiError} />
      </div>
    </>
  );
}
