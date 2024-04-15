import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [apiError, setApiError] = useState(null);
  const [clientNameError, setClientNameError] = useState(null);
  const [clientCapacityError, setClientCapacityError] = useState(null);
  const history = useHistory();

  // Client-side name validation
  const nameError = new Error();

  function validateName({ target }) {
    setClientNameError(null);

    const tableName = target.value;

    if (tableName.length < 2) {
      nameError.message = "Table name must be at least 2 characters";
    }

    if (nameError.message) {
      setClientNameError(nameError);
    }
  }

  // Client-side capacity validation
  const capacityError = new Error();

  function validateCapacity({ target }) {
    setClientCapacityError(null);

    const capacityInput = target.value;

    if (Number(capacityInput) === NaN) {
      capacityError.message = "Table capacity must be a number";
    }

    if (Number(capacityInput) < 1) {
      capacityError.message = "Tables must seat at least 1 person";
    }

    if (capacityError.message) {
      setClientCapacityError(capacityError);
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
    try {
      await createTable(formData);
      history.push("/dashboard");
    } catch (error) {
      setApiError(error);
    }
  }

  return (
    <main>
      <h1>New Table</h1>

      <div className="row mx-1 my-1">
        <ol class="breadcrumb border w-100">
          <li class="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li class="breadcrumb-item active">New Table</li>
        </ol>
      </div>

      <article className="card row m-1">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label for="table_name" className="formLabel">
              <h5>Table Name</h5>
            </label>
            <input
              type="text"
              className="form-control mb-2"
              id="table_name"
              name="table_name"
              placeHolder="Bar 1"
              onInput={validateName}
              onChange={handleChange}
              value={formData.table_name}
            ></input>

            {/* Client table_name error alert(s) */}
            <ErrorAlert error={clientNameError} />

            <label for="capacity" className="formLabel">
              <h5>Table Capacity</h5>
            </label>
            <input
              type="number"
              className="form-control mb-2"
              id="capacity"
              name="capacity"
              placeHolder="4"
              min="1"
              max="99"
              onInput={validateCapacity}
              onChange={handleChange}
              value={formData.capacity}
            ></input>

            {/* Client capacity error alert(s) */}
            <ErrorAlert error={clientCapacityError} />

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

export default CreateTable;
