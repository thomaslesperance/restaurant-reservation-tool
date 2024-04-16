import React from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import Table from "../tables/Table";
import Reservation from "../reservations/Reservation";

function Dashboard({
  date,
  today,
  reservations,
  setReservations,
  tables,
  setTables,
  reservationsError,
  setReservationsError,
  tablesError,
  setTablesError,
  previousDate,
  nextDate,
}) {
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
