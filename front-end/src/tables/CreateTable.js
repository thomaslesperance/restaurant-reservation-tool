import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//
import Header from "../layout/Header";
import ErrorAlert from "../layout/ErrorAlert";
//
import { createTable } from "../utils/api";
//

export default function CreateTable() {
  const history = useHistory();

  const [formData, setFormData] = useState({ table_name: "", capacity: "" });
  const [apiError, setApiError] = useState(null);
  const [formError, setFormError] = useState(null);

  // Form data validation funcitons
  function validateName(formFields, errorMessages) {
    if (formFields.table_name.length < 2) {
      errorMessages.push("Table name must be at least 2 characters");
    }
  }

  function validateCapacity(formFields, errorMessages) {
    if (Number(formFields.capacity) < 1) {
      errorMessages.push("Tables must seat at least 1 person");
    }
  }
  /////////////////////////////

  // Handlers and data validation sequence

  function validateInputs(formFields) {
    const errorMessages = [];

    validateName(formFields, errorMessages);
    validateCapacity(formFields, errorMessages);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError(null);
    validateInputs(formData);
    if (!formError) {
      try {
        await createTable(formData);
        history.push("/dashboard");
      } catch (error) {
        setApiError(error);
      }
    }
  }

  return (
    <main>
      <Header headerTitle={"New Table"} />

      <article className="card row m-1">
        <ErrorAlert error={formError} />
        <form className="card-body" onSubmit={handleSubmit}>
          <label htmlFor="table_name" className="formLabel">
            <h5>Table Name</h5>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="table_name"
            name="table_name"
            placeholder="Bar 1"
            onChange={handleChange}
            value={formData.table_name}
          ></input>

          <label htmlFor="capacity" className="formLabel">
            <h5>Table Capacity</h5>
          </label>
          <input
            type="number"
            className="form-control mb-2"
            id="capacity"
            name="capacity"
            placeholder="4"
            min="1"
            max="99"
            onChange={handleChange}
            value={formData.capacity}
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
