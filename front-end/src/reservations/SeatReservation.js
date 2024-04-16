import React from "react";
import { Link } from "react-router-dom";

function SeatReservation() {
  // Button handlers

  // Need tables and reservations
  function handleSubmit(event) {}

  return (
    <main>
      <h1>Seat Reservation</h1>

      <div className="row mx-1 my-1">
        <ol class="breadcrumb border w-100">
          <li class="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li class="breadcrumb-item active">Seat Reservation</li>
        </ol>
      </div>

      <div className="row m-1 card">
        <h5 className="card-title">Reservation info here...</h5>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label for="table_id" className="formLabel">
              <h5>Select Table</h5>
            </label>
            <select className="form-control mb-2" name="table_id" />
          </form>
        </div>
      </div>
    </main>
  );
}

export default SeatReservation;
