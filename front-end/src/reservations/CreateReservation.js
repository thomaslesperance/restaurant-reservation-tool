import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//
import Header from "../layout/Header";
//
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
//

//TO FIX:
//-REFACTOR CODE TO USE SEPARATE FORM COMPONENT
//-CORRECT DATA VALIDATION/CONSOLIDATE AND MIRROR BACKEND
//-CHANGE INPUT TYPE FOR PEOPLE TO PRODUCE "NUMBER" TYPE DATE SENT TO BACKEND

export default function CreateReservation() {
  const history = useHistory();

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

  //Client-side date validation
  const dateError = new Error();

  function validateDate({ target }) {
    setClientDateError(null);
    const dateObject = new Date(target.value);
    const dateData = {
      dayOfWeek: dateObject.getDay(),
      currentDate: new Date().getDate(),
      date: dateObject.getDate(),
    };
    notATuesday(dateData);
    notOnPreviousDate(dateData);
    if (dateError.message) {
      setClientDateError(dateError);
    }
  }

  function notATuesday(dateData) {
    const { dayOfWeek } = dateData;
    if (dayOfWeek === 2) {
      dateError.message = "Reservations cannot be on a Tuesday";
    }
  }

  function notOnPreviousDate(dateData) {
    const { currentDate, date } = dateData;
    if (date - currentDate < 0) {
      if (dateError.message) {
        dateError.message = dateError.message.concat(
          "; reservations cannot be made for a previous date"
        );
      } else {
        dateError.message = "Reservations cannot be on a previous date";
      }
    }
  }
  /////////////////////////////

  //Client-side time validation
  const timeError = new Error();

  function validateTime({ target }) {
    setClientTimeError(null);
    const [hours, minutes] = target.value.split(":");
    const timeData = {
      hours: Number(hours),
      minutes: Number(minutes),
      currentHours: new Date().getHours(),
      currentMinutes: new Date().getMinutes(),
    };
    notAtPreviousTime(timeData);
    notAfter930(timeData);
    notBefore1030(timeData);
    if (timeError.message) {
      setClientTimeError(timeError);
    }
  }

  function notAtPreviousTime(timeData) {
    const { hours, minutes, currentHours, currentMinutes } = timeData;
    if (
      (hours === currentHours && minutes < currentMinutes) ||
      hours < currentHours
    ) {
      timeError.message = "Reservations cannot be made for a previous time";
    }
  }

  function notAfter930(timeData) {
    const { hours, minutes } = timeData;
    if ((hours === 21 && minutes >= 30) || hours > 21) {
      timeError.message = "Reservations cannot be made after 9:30 PM";
    }
  }

  function notBefore1030(timeData) {
    const { hours, minutes } = timeData;
    if ((hours === 10 && minutes <= 30) || hours < 10) {
      timeError.message = "Reservations cannot be made before 10:30 AM";
    }
  }
  /////////////////////////////

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
      .then(() => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch(setApiError);
  }

  return (
    <main>
      <Header headerTitle={"New Reservation"} />

      <article className="card row m-1">
        <form className="card-body" onSubmit={handleSubmit}>
          <label htmlFor="first_name" className="formLabel">
            <h5>First Name</h5>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="first_name"
            name="first_name"
            placeholder="Jane"
            onChange={handleChange}
            value={formData.first_name}
          ></input>

          <label htmlFor="last_name" className="formLabel">
            <h5>Last Name</h5>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="last_name"
            name="last_name"
            placeholder="Doe"
            onChange={handleChange}
            value={formData.last_name}
          ></input>

          <label htmlFor="mobile_number" className="formLabel">
            <h5>Mobile Number</h5>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="mobile_number"
            name="mobile_number"
            placeholder="(XXX) XXX-XXXX"
            onChange={handleChange}
            value={formData.mobile_number}
          ></input>

          <label htmlFor="reservation_date" className="formLabel">
            <h5>Reservation Date</h5>
          </label>

          <input
            type="date"
            className="form-control mb-2"
            id="reservation_date"
            name="reservation_date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            onInput={validateDate}
            onChange={handleChange}
            value={formData.reservation_date}
          ></input>

          <ErrorAlert error={clientDateError} />

          <label htmlFor="reservation_time" className="formLabel">
            <h5>Reservation Time</h5>
          </label>
          <input
            type="time"
            className="form-control mb-2"
            id="reservation_time"
            name="reservation_time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            onInput={validateTime}
            onChange={handleChange}
            value={formData.reservation_time}
          ></input>

          <ErrorAlert error={clientTimeError} />

          <label htmlFor="people" className="formLabel">
            <h5>Party Size</h5>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="people"
            name="people"
            placeholder="XX"
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

          <ErrorAlert error={apiError} />
        </form>
      </article>
    </main>
  );
}
