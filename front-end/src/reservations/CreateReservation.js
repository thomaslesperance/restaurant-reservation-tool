import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [apiError, setApiError] = useState(null);
  const [clientDateError, setClientDateError] = useState(null);
  const [clientTimeError, setClientTimeError] = useState(null);
  const history = useHistory();

  //Client-side date validation
  const dateError = new Error();

  function validateDate({ target }) {
    notATuesday(target);
    notOnPreviousDate(target);

    if (dateError.message) {
      setClientDateError(dateError);
    }
  }

  function notATuesday(target) {
    const resDayOfWeek = new Date(target.value.replaceAll("-", "/")).getDay();

    if (resDayOfWeek === 2) {
      dateError.message = "Reservations cannot be on a Tuesday";
    }
  }

  function notOnPreviousDate(target) {
    const presentDate = new Date().getDate();
    const resDate = new Date(target.value.replaceAll("-", "/")).getDate();

    if (resDate - presentDate < 0) {
      if (dateError.message) {
        dateError.message = dateError.message.concat(
          "; reservations cannot be made for a previous date"
        );
      } else {
        dateError.message = "Reservations cannot be on a previous date";
      }
    }
  }

  //Client-side time validation
  const timeError = new Error();

  function validateTime({ target }) {
    notAtPreviousTime(target);
    notAfter930(target);
    notBefore1030(target);

    if (timeError.message) {
      setClientTimeError(timeError);
    }
  }

  function notAtPreviousTime(target) {}
  function notAfter930(target) {}
  function notBefore1030(target) {}

  //Sync form input values with formData state
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  async function handleSubmit(event) {
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

      <article className="card row mx-1 my-1">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
              pattern="\d{4}-\d{2}-\d{2}"
              onInput={validateDate}
              onChange={handleChange}
              value={formData.reservation_date}
            ></input>

            {/* Client date error alert(s) */}
            <ErrorAlert error={clientDateError} />

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
              onInput={validateTime}
              onChange={handleChange}
              value={formData.reservation_time}
            ></input>

            {/* Client time error alert(s) */}
            <ErrorAlert error={clientTimeError} />

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

            {/* API error alert */}
            <ErrorAlert error={apiError} />
          </form>
        </div>
      </article>
    </main>
  );
}

export default CreateReservation;

//  New reservation needed validations:
//  Date-
/// Not a Tuesday
/// Not in the past(date)
/// Time-
/// Not in the past(time)
/// Not after 9:30 PM
/// Not before 10:30 AM
/// validateDate = [notATuesday, notOnPreviousDate]
/// validateTime = [notAtPreviousTime, notAfter930, notBefore1030]
/// Event object created by input elements passed to & mutated by each
