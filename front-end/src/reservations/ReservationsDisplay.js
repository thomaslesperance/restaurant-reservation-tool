import React, { useState } from "react";
//
import Reservation from "./Reservation";
import ErrorAlert from "../layout/ErrorAlert";
//

export default function ReservationsDisplay({
  reservations,
  setReservationsUpdated,
}) {
  const [reservationsError, setReservationsError] = useState(null);

  const reservationArray = reservations.reduce((accumulator, reservation) => {
    if (reservation.status !== "finished") {
      const component = (
        <Reservation
          key={reservation.reservation_id}
          data={reservation}
          setReservationsError={setReservationsError}
          setReservationsUpdated={setReservationsUpdated}
        />
      );
      accumulator.push(component);
      return accumulator;
    } else {
      return accumulator;
    }
  }, []);

  const reservationComponents = reservationArray.length ? (
    reservationArray
  ) : (
    <div className="row m-1 justify-content-center">
      <h6>No reservations found</h6>
    </div>
  );

  return (
    <>
      <ErrorAlert error={reservationsError} />
      <div>{reservationComponents}</div>
    </>
  );
}
