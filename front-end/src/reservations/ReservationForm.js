import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//
import ErrorAlert from "../layout/ErrorAlert";
//

export default function ReservationForm({ handleSubmit, initialFormData }) {
  const history = useHistory();

  const [formData, setFormData] = useState({ ...initialFormData });
  const [formError, setFormError] = useState(null);

  // Form data validation funcitons
  function formDataHas(formField, formFields, errorMessages) {
    if (!formFields[formField]) {
      errorMessages.push(`Missing ${formField}`);
    }
  }

  function constructDateValues(dateData, formFields) {
    const { reservation_date, reservation_time } = formFields;
    const dateObject = new Date(`${reservation_date}T${reservation_time}`);

    dateData.dateObject = dateObject;
    dateData.year = dateObject.getFullYear();
    dateData.month = dateObject.getMonth();
    dateData.day = dateObject.getDate();
    dateData.hours = Number(dateObject.getHours());
    dateData.minutes = Number(dateObject.getMinutes());
    dateData.dayOfWeek = dateObject.getDay();
    dateData.currentDateObject = new Date();
  }

  function notATuesday(dateData, errorMessages) {
    if (dateData.dayOfWeek === 2) {
      errorMessages.push("Store closed on Tuesday's");
    }
  }

  function notAtPreviousTime(dateData, errorMessages) {
    const { dateObject, currentDateObject } = dateData;

    if (dateObject - currentDateObject < 0) {
      errorMessages.push(
        "Reservations must be made for a future date and time"
      );
    }
  }

  function notAfter930(dateData, errorMessages) {
    const { hours, minutes } = dateData;

    if ((hours === 21 && minutes >= 30) || hours > 21) {
      errorMessages.push("Reservations cannot be made after 9:30 PM");
    }
  }

  function notBefore1030(dateData, errorMessages) {
    const { hours, minutes } = dateData;

    if ((hours === 10 && minutes <= 30) || hours < 10) {
      errorMessages.push("Reservations cannot be made before 10:30 AM");
    }
  }
  /////////////////////////////

  // Handlers and data validation sequence
  function validateInputs(formFields) {
    const errorMessages = [];
    const dateData = {};

    formDataHas("first_name", formFields, errorMessages);
    formDataHas("last_name", formFields, errorMessages);
    formDataHas("mobile_number", formFields, errorMessages);
    formDataHas("reservation_date", formFields, errorMessages);
    formDataHas("reservation_time", formFields, errorMessages);
    formDataHas("people", formFields, errorMessages);

    constructDateValues(dateData, formFields);

    notATuesday(dateData, errorMessages);
    notAtPreviousTime(dateData, errorMessages);
    notAfter930(dateData, errorMessages);
    notBefore1030(dateData, errorMessages);

    if (errorMessages.length) {
      setFormError(new Error(errorMessages.join(" / ")));
    }
  }

  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    validateInputs(formData);
    if (!formError) {
      handleSubmit(formData);
    }
  }
  /////////////////////////////

  return (
    <>
      <article className="card row m-1">
        <ErrorAlert error={formError} />

        <form className="card-body" onSubmit={onSubmit}>
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
            type="number"
            className="form-control mb-2"
            id="mobile_number"
            name="mobile_number"
            min="1000000000"
            max="9999999999"
            placeholder="8001239876"
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
            onChange={handleChange}
            value={formData.reservation_date}
          ></input>

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
            onChange={handleChange}
            value={formData.reservation_time}
          ></input>

          <label htmlFor="people" className="formLabel">
            <h5>Party Size</h5>
          </label>
          <input
            type="number"
            className="form-control mb-2"
            id="people"
            name="people"
            placeholder="5"
            min="1"
            max="99"
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
        </form>
      </article>
    </>
  );
}
