import React, { useEffect, useState } from "react";

const TestAPI = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/test`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Backend Test:</h2>
      <p>{message}</p>
    </div>
  );
};

export default TestAPI;