import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
//
import Header from "../layout/Header";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
//
import { readReservation, updateReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
//

export default function EditReservation() {
  const history = useHistory();
  const { reservationId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [reservation, setReservation] = useState(null);

  useEffect(loadReservation, [reservationId]);

  function loadReservation() {
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
  /////////////////////////////

  async function handleSubmit(formInput) {
    setApiError(null);
    updateReservation(formInput, reservationId)
      .then(() => {
        history.push(`/dashboard?date=${formInput.reservation_date}`);
      })
      .catch(setApiError);
  }
  /////////////////////////////

  if (isLoading) {
    return (
      <>
        <Header headerTitle={"Edit Reservation"} />
        <div>Loading...</div>)
      </>
    );
  }

  return (
    <main>
      <Header headerTitle={"Edit Reservation"} />
      <ErrorAlert error={apiError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        initialFormData={reservation}
      />
    </main>
  );
}
