import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
import Table from "../tables/Table";
import Reservation from "../reservations/Reservation";
//
import { listTables, listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";

function Dashboard() {
  console.log("top of Dashboard");

  // Hooks / state
  const { search } = useLocation();

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  // Variables
  const searchParams = new URLSearchParams(search);
  const date = searchParams.size ? searchParams.get("date") : today();
  const previousDate = previous(date);
  const nextDate = next(date);

  // useEffect()
  useEffect(loadTables, []); // tables = type Array
  useEffect(loadReservations, [date]); // reservations = type Array

  function loadTables() {
    console.log("loadTables");
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function loadReservations() {
    console.log("loadReservations");
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  ////

  // Component lists
  const tableDisplays = tables.map((table) => {
    return <Table key={table.table_id} data={table} setTables={setTables} />;
  });

  const reservationDisplays = reservations.map((reservation) => {
    return (
      <Reservation
        key={reservation.reservation_id}
        data={reservation}
        setReservations={setReservations}
      />
    );
  });
  ////

  return (
    <main>
      <h1>Dashboard</h1>

      <div className="row mx-1 my-1">
        <ol className="breadcrumb border w-100">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </div>

      <div className="row m-1">
        <h4>Tables</h4>
      </div>

      {/* API tables error alert */}
      <ErrorAlert error={tablesError} />

      {/* To take a gander at the raw JSON returned from the API, uncomment below: */}
      {/* {JSON.stringify(tables)} */}

      <section className="row m-1 mb-4">{tableDisplays}</section>

      <div className="row mx-1 my-1">
        <h4>Reservations for {date === today ? "Today" : date}</h4>
      </div>

      <div className="row mx-1 mt-1 mb-4">
        <div className="col-3 mx-auto p-0">
          <Link
            to={`/dashboard?date=${previousDate}`}
            className="btn btn-primary w-100"
          >
            Previous
          </Link>
        </div>

        <div className="col-3 mx-auto p-0">
          <Link
            to={`/dashboard?date=${nextDate}`}
            className="btn btn-primary w-100"
          >
            Next
          </Link>
        </div>
      </div>

      {/* API reservations error alert */}
      <ErrorAlert error={reservationsError} />

      {/* To take a gander at the raw JSON returned from the API, uncomment below: */}
      {/* {JSON.stringify(reservations)} */}

      <section>{reservationDisplays}</section>
    </main>
  );
}

export default Dashboard;
