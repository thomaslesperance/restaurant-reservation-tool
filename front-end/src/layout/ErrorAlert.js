import React from "react";

function ErrorAlert({ error }) {
  return (
    error && (
      <div className="row alert alert-danger mx-1 my-2">
        Error: {error.message}
      </div>
    )
  );
}

export default ErrorAlert;
