import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//
import Header from "../layout/Header";
import Reservation from "./Reservation";
import ErrorAlert from "../layout/ErrorAlert";
import TableSelector from "../tables/TableSelector";
//
import { readReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
//

export default function SeatReservation() {
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(loadReservation, [reservationId]); // reservation = type Object

  function loadReservation() {
    setApiError(null);
    const abortController = new AbortController();
    readReservation({ reservation_id: reservationId }, abortController.signal)
      .then((response) => {
        formatReservationDate(response);
        formatReservationTime(response);
        setReservation(response);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  return (
    <main>
      <Header headerTitle={"Seat Reservation"} />
      <Reservation data={reservation} />
      <ErrorAlert error={apiError} />
      <TableSelector reservation={reservation} />
    </main>
  );
}
