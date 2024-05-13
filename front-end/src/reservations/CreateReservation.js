import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//
import Header from "../layout/Header";
import ReservationForm from "./ReservationForm";
//
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
//

export default function CreateReservation() {
  const history = useHistory();
  const [apiError, setApiError] = useState(null);

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  /////////////////////////////

  async function handleSubmit(formInput) {
    setApiError(null);
    createReservation(formInput)
      .then(() => {
        history.push(`/dashboard?date=${formInput.reservation_date}`);
      })
      .catch(setApiError);
  }
  /////////////////////////////

  return (
    <main>
      <Header headerTitle={"New Reservation"} />
      <ErrorAlert error={apiError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        initialFormData={initialFormData}
      />
    </main>
  );
}
