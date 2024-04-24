import React from "react";
import Reservation from "./Reservation";

export default function ReservationsDisplay({ reservations }) {
  const reservationArray = reservations.reduce((accumulator, reservation) => {
    if (reservation.status !== "finished") {
      const component = (
        <Reservation key={reservation.reservation_id} data={reservation} />
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

  return <>{reservationComponents}</>;
}
