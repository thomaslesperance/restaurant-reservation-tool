import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
//
import { readReservation, updateReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
//

function EditReservation() {
  console.log("top of EditReservation");

  //Hooks
  const history = useHistory();
  const { reservationId } = useParams();

  //State
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [apiError, setApiError] = useState(null);
  const [clientDateError, setClientDateError] = useState(null);
  const [clientTimeError, setClientTimeError] = useState(null);

  useEffect(loadReservation, []);

  function loadReservation() {
    console.log("loadReservation");
    setIsLoading(true);
    setApiError(null);
    const abortController = new AbortController();
    readReservation({ reservation_id: reservationId }, abortController.signal)
      .then((response) => {
        formatReservationDate(response);
        formatReservationTime(response);
        console.log(response);
        setFormData(response);
        setIsLoading(false);
      })
      .catch(setApiError);
    return () => abortController.abort();
  }

  //Client-side date validation
  const dateError = new Error();

  function validateDate({ target }) {
    setClientDateError(null);

    const dateObject = new Date(target.value.replaceAll("-", "/"));

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
    updateReservation(formData, formData.reservation_id)
      .then(() => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch(setApiError);
  }

  if (isLoading) {
    return <div>Loading...</div>;
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

export default EditReservation;
