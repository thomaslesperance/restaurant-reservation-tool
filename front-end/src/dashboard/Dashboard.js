import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTables, listReservations } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import Table from "../tables/Table";
import Reservation from "../reservations/Reservation";

function Dashboard({ date, today }) {
  //  reservations will be of type array based on knex api result of .select()
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const previousDate = previous(date);
  const nextDate = next(date);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setTablesError(null);
    setReservationsError(null);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const tableDisplays = tables.map((table) => {
    return <Table key={table.table_id} data={table} />;
  });

  const reservationDisplays = reservations.map((reservation) => {
    return <Reservation key={reservation.reservation_id} data={reservation} />;
  });

  return (
    <main>
      <h1>Dashboard</h1>

      <div className="row mx-1 my-1">
        <ol className="breadcrumb border w-100">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
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

      {/* API reservations error alert */}
      <ErrorAlert error={reservationsError} />

      {/* To take a gander at the raw JSON returned from the API, uncomment below: */}
      {/* {JSON.stringify(reservations)} */}

      <section>{reservationDisplays}</section>
    </main>
  );
}

export default Dashboard;
