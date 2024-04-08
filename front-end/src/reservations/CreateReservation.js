import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation() {
  //Initial form data
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
  };

  //Initialize state and history
  const [formData, setFormData] = useState({ ...initialFormData });
  const [createReservationError, setCreateReservationError] = useState(null);
  const history = useHistory();

  //Form change handler
  //Sync form input values with formData state
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  //Form submit handler
  //Calls API with createReservation() and catches any returned error to use in <ErrorAlert />
  async function submitHandler(event) {
    event.preventDefault();
    setCreateReservationError(null);
    createReservation(formData)
      .then(() => history.push("/dashboard"))
      .catch(setCreateReservationError);
  }

  //Return JSX containing breadcrumb and form elements
  return (
    <main>
      <h1>New Reservation</h1>

      <div className="row mb-4">
        <ol class="breadcrumb border" style={{ width: "90%" }}>
          <li class="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li class="breadcrumb-item active">New Reservation</li>
        </ol>
      </div>

      <ErrorAlert error={createReservationError} />

      <div className="row">
        <div className="card" style={{ width: "90%" }}>
          <div className="card-body">
            <form onSubmit={submitHandler}>
              <label for="first_name" className="formLabel">
                First Name
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="first_name"
                name="first_name"
                placeHolder="First name"
                onChange={handleChange}
                value={formData.first_name}
              ></input>

              <label for="last_name" className="formLabel">
                Last Name
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="last_name"
                name="last_name"
                placeHolder="Last name"
                onChange={handleChange}
                value={formData.last_name}
              ></input>

              <label for="mobile_number" className="formLabel">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="mobile_number"
                name="mobile_number"
                placeHolder="(XXX) XXX-XXXX"
                onChange={handleChange}
                value={formData.mobile_number}
              ></input>

              <label for="reservation_date" className="formLabel">
                Reservation Date
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="reservation_date"
                name="reservation_date"
                placeHolder="XX-XX-XXXX"
                onChange={handleChange}
                value={formData.reservation_date}
              ></input>

              <label for="reservation_time" className="formLabel">
                Reservation Time
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="reservation_time"
                name="reservation_time"
                placeHolder="XX:XX AM/PM"
                onChange={handleChange}
                value={formData.reservation_time}
              ></input>

              <button
                type="button"
                className="btn btn-secondary mr-3"
                onClick={() => history.push("/")}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateReservation;
