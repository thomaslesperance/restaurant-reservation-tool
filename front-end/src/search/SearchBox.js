import React, { useRef } from "react";

function SearchBox({ setSearchString }) {
  const mobileRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    setSearchString(mobileRef.current.value);
  }

  return (
    <form className="card-body row m-1 p-0 border" onSubmit={handleSubmit}>
      <div className="col-md p-2">
        <input
          type="text"
          className="form-control"
          id="mobile_number"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          ref={mobileRef}
        ></input>
      </div>

      <button type="submit" className="col-md-2 btn btn-primary btn-small m-1">
        Find
      </button>
    </form>
  );
}

export default SearchBox;
