import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
import Table from "../tables/Table";
import Reservation from "../reservations/Reservation";
//
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";

function Dashboard() {
  console.log("top of Dashboard");

  //Hooks
  const { search } = useLocation();

  //State
  const [isLoading, setIsLoading] = useState(false);
  //
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  //

  //Calculate date for browsing reservations
  let date;
  const searchParams = new URLSearchParams(search);

  if (searchParams.has("date")) {
    date = searchParams.get("date");
  } else {
    date = today();
  }

  //useEffect
  useEffect(loadTables, []); // tables = type Array
  useEffect(loadReservations, [date]); // reservations = type Array

  function loadTables() {
    console.log("loadTables");
    setIsLoading(true);
    setTablesError(null);
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then((response) => {
        setTables(response);
        setIsLoading(false);
      })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function loadReservations() {
    console.log("loadReservations: date using:", date);
    setIsLoading(true);
    setReservationsError(null);
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then((response) => {
        setReservations(response);
        setIsLoading(false);
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  ////

  // Component lists
  const tableDisplays = tables.map((table) => {
    return (
      <Table
        key={table.table_id}
        table={table}
        setTablesError={setTablesError}
      />
    );
  });

  const reservationDisplays = reservations.map((reservation) => {
    return <Reservation key={reservation.reservation_id} data={reservation} />;
  });
  ////

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

      <div className="row m-1 border p-2">
        <div className="col-md text-nowrap">
          <h4>Reservations</h4>
          <h4>[ {date === today ? "Today" : date} ]</h4>
        </div>

        <div className="col-md-3 mb-1 align-self-end">
          <Link
            to={`/dashboard?date=${previous(date)}`}
            className="btn btn-primary w-100"
          >
            Previous
          </Link>
        </div>

        <div className="col-md-3 mb-1 align-self-end">
          <Link
            to={`/dashboard?date=${next(date)}`}
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

      <section>
        {reservationDisplays.length ? (
          reservationDisplays
        ) : (
          <h6 className="row m-1 justify-content-center">
            No reservations for this date
          </h6>
        )}
      </section>
    </main>
  );
}

export default Dashboard;

//Gray out seat button when reservation is seated
//Break out tables and breadcrumb as components
