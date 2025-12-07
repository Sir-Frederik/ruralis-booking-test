import BookingsTable from "./components/BookingsTable";

function App() {
  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: "#f5f1eb" }}>
      <div className="container">
        <h1 className="text-center mb-4" style={{ color: "#2d4a3e" }}>
          Ruralis Admin Dashboard
        </h1>
        <BookingsTable />
      </div>
    </div>
  );
}

export default App;
