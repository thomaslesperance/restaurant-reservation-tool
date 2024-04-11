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
    people: "",
  };

  //Initialize state and history
  const [formData, setFormData] = useState({ ...initialFormData });
  const [apiError, setApiError] = useState(null);
  const [formError, setFormError] = useState(null);
  const history = useHistory();

  //Client-side form validation
  function validateDate({ target }) {
    let errorString = "";

    //Ensure date input is not a Tuesday
    const dateObj = new Date(target.value.replace("-", "/"));
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 1) {
      if (errorString) {
        errorString = errorString.concat(
          "; ",
          "reservation date cannot be a Tuesday"
        );
      } else {
        errorString = "Reservation date cannot be a Tuesday";
      }
    }

    //Ensure date input is not in the past
    const resDate = Date.parse(target.value.replace("-", "/"));
    const present = Date.now();
    console.log(
      "resDate",
      new Date(resDate).getDate(),
      "present",
      new Date(present).getDate()
    );

    if (resDate - present < -1) {
      if (errorString) {
        errorString = errorString.concat(
          "; ",
          "reservations cannot be made for a previous date"
        );
      } else {
        errorString = "Reservations cannot be made for a previous date";
      }
    }

    setFormError(Error(errorString));
  }

  //Sync form input values with formData state
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    setApiError(null);
    createReservation(formData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setApiError);
  }

  return (
    <main>
      <h1>New Reservation</h1>

      <div className="row mx-1 my-1">
        <ol class="breadcrumb border w-100">
          <li class="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li class="breadcrumb-item active">New Reservation</li>
        </ol>
      </div>

      {/* API error alert */}
      <ErrorAlert error={apiError} />

      <article className="card row mx-1 my-1">
        <div className="card-body">
          <form onSubmit={submitHandler}>
            <label for="first_name" className="formLabel">
              <h5>First Name</h5>
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id="first_name"
              name="first_name"
              placeHolder="Jane"
              onChange={handleChange}
              value={formData.first_name}
            ></input>

            <label for="last_name" className="formLabel">
              <h5>Last Name</h5>
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id="last_name"
              name="last_name"
              placeHolder="Doe"
              onChange={handleChange}
              value={formData.last_name}
            ></input>

            <label for="mobile_number" className="formLabel">
              <h5>Mobile Number</h5>
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
              <h5>Reservation Date</h5>
            </label>
            <input
              type="date"
              className="form-control mb-2"
              id="reservation_date"
              name="reservation_date"
              placeHolder="YYYY-MM-DD"
              // pattern="\d{4}-\d{2}-\d{2}"
              onInput={validateDate}
              onChange={handleChange}
              value={formData.reservation_date}
            ></input>

            <label for="reservation_time" className="formLabel">
              <h5>Reservation Time</h5>
            </label>
            <input
              type="time"
              className="form-control mb-2"
              id="reservation_time"
              name="reservation_time"
              placeHolder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={handleChange}
              value={formData.reservation_time}
            ></input>

            <label for="people" className="formLabel">
              <h5>Party Size</h5>
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id="people"
              name="people"
              placeHolder="XX"
              onChange={handleChange}
              value={formData.people}
            ></input>

            {/* Client error alert(s) */}
            <ErrorAlert error={formError} />

            <button type="submit" className="btn btn-primary mr-1">
              Submit
            </button>

            <button
              type="button"
              className="btn btn-secondary mr-1"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </form>
        </div>
      </article>
    </main>
  );
}

export default CreateReservation;
