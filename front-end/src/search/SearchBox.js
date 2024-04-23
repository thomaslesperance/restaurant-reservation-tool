import React, { useRef } from "react";

function SearchBox({ setSearchString }) {
  const mobileRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setSearchString(mobileRef.current.value);
  }

  return (
    <div className="card row m-1">
      <form className="card-body row m-1 p-0" onSubmit={handleSubmit}>
        <div className="col-md">
          <label htmlFor="mobile_number" className="formLabel m-0">
            <h6>Search by Mobile Number</h6>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            id="mobile_number"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            ref={mobileRef}
          ></input>
        </div>
        <button
          type="submit"
          className="col-md-2 btn btn-primary btn-small my-2 mr-1"
        >
          Find
        </button>
      </form>
    </div>
  );
}

export default SearchBox;
