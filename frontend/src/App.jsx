import { useState, useEffect } from "react";
import BookingsTable from "./components/BookingsTable";
function App() {
  return (
    <>
      {" "}
      <div className="App">
        <h1> Admin Dashboard</h1>
        <BookingsTable />
      </div>
    </>
  );
}

export default App;
