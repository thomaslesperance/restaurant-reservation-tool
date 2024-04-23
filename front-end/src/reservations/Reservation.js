import React from "react";
import { Link } from "react-router-dom";
//
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import { updateReservationStatus } from "../utils/api";
//
function Reservation({ data }) {
  //  Need delete button handler

  formatReservationDate(data);
  formatReservationTime(data);

  function handleCancel() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateReservationStatus({ status: "cancelled" }, data.reservation_id)
        .then(window.location.reload())
        .catch(console.log);
    } else {
      return;
    }
  }

  return (
    <article className="card row m-1 p-0">
      <div className="card-header p-2">
        <h5>
          {data.first_name} {data.last_name}
        </h5>
        <h6 data-reservation-id-status={data.reservation_id}>{data.status}</h6>
      </div>
      <div className="card-body">
        <p className="card-text">Mobile Number: {data.mobile_number}</p>
        <p className="card-text">Reservation Date: {data.reservation_date}</p>
        <p className="card-text">Reservation Time: {data.reservation_time}</p>
        <p className="card-text">Party Size: {data.people}</p>
        <p className="card-text">Created At: {data.created_at}</p>
        <p className="card-text">Last Updated: {data.updated_at}</p>
        <h6 className="card-text">Reservation ID: {data.reservation_id}</h6>
      </div>
      <div className="card-footer p-0">
        <div className="row m-1">
          <div className="col-md-2 m-1 p-0">
            {data.status === "booked" && (
              <Link
                to={`/reservations/${data.reservation_id}/seat`}
                className="btn btn-primary w-100 text-nowrap"
              >
                Seat
              </Link>
            )}
          </div>

          <div className="col-md-2 m-1 p-0">
            {data.status === "booked" && (
              <Link
                to={`/reservations/${data.reservation_id}/edit`}
                className="btn btn-secondary w-100 text-nowrap"
                href={`/reservations/${data.reservation_id}/edit`}
              >
                Edit
              </Link>
            )}
          </div>

          <div className="col-md-2 m-1 p-0">
            {data.status === "booked" && (
              <button
                onClick={handleCancel}
                className="btn btn-secondary w-100 text-nowrap"
                data-reservation-id-cancel={data.reservation_id}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default Reservation;
