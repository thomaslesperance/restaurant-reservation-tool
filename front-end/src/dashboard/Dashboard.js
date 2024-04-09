import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, today }) {
  //  reservations will be of type array based on knex api result of .select()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationDisplays = reservations.map((reservation) => {
    return <Reservation key={reservation.reservation_id} data={reservation} />;
  });

  return (
    <main>
      <h1>Dashboard</h1>

      <div className="row mx-1 my-1">
        <ol className="breadcrumb border" style={{ width: "100%" }}>
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </div>

      <div className="row mx-1 my-1">
        <h4>Reservations for {date === today ? "Today" : date}:</h4>
      </div>

      <ErrorAlert className="row mx-1 my-1" error={reservationsError} />

      {/* {JSON.stringify(reservations)} */}
      <section>{reservationDisplays}</section>
    </main>
  );
}

export default Dashboard;
