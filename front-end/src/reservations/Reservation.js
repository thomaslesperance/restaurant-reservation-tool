import React from "react";
import { Link } from "react-router-dom";

function Reservation({ data }) {
  //  Need delete button handler

  return (
    <article className="card row mx-1 my-1">
      <div className="card-body">
        <h5 className="card-title">
          {data.first_name} {data.last_name}
        </h5>

        <p className="card-text">Mobile Number: {data.mobile_number}</p>
        <p className="card-text">Reservation Date: {data.reservation_date}</p>
        <p className="card-text">Reservation Time: {data.reservation_time}</p>
        <p className="card-text">Party Size: {data.people}</p>
        <p className="card-text">Created At: {data.created_at}</p>
        <p className="card-text">Last Updated: {data.updated_at}</p>
        <h6 className="card-text">Reservation ID: {data.reservation_id}</h6>

        <div className="row mx-1 my-1">
          <div className="col-2 mr-1 p-0">
            <Link
              to={`/reservations/${data.reservation_id}/seat`}
              className="btn btn-primary w-100 text-nowrap"
            >
              Seat
            </Link>
          </div>

          <div className="col-2 mr-1 p-0">
            <Link
              to={`/reservations/${data.reservation_id}/edit`}
              className="btn btn-secondary w-100 text-nowrap"
            >
              Edit
            </Link>
          </div>

          <div className="col-2 mr-1 p-0">
            <Link
              to="/Dashboard"
              className="btn btn-secondary w-100 text-nowrap"
            >
              Delete
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Reservation;
