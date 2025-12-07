import { useState, useEffect } from "react";
import "./BookingsTable.css";

function BookingsTable() {
  //stato per salvare i booking della pagina corrente
  const [bookings, setBookings] = useState([]);
  //info di pagoinazione da backend
  const [pagination, setPagination] = useState(null);
  //pagina attuale
  const [currentPage, setcurrentPage] = useState(1);

  //stato per mostrare il loading
  const [loading, setLoading] = useState(true);
  // stato pe reventuali errori
  const [error, setError] = useState(null);

  //numeor di oggetti per ogni pagina
  const ItemsOnPage = 10;

  const fetchBookings = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/bookings?page=${page}&limit=${ItemsOnPage}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json(); //conversione in json
      //aggiorno gli stati
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // pagina nuova, nuova fetch
  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  //pagina precedente
  const handlePrevious = () => {
    if (currentPage > 1) {
      setcurrentPage(currentPage - 1);
    }
  };
  //pagina successiva
  const handleNext = () => {
    if (pagination?.hasMore) {
      setcurrentPage(currentPage + 1);
    }
  };

  //Renderizzo il caricamento
  if (loading) {
    return (
      <div className="card bookings-card">
        <div className="card-body text-center py-5">
          <div className="spinner-border loading-spinner mb-3" role="status"></div>
          <p className="text-muted">Caricamento Prenotazioni... ⏳</p>
        </div>
      </div>
    );
  }

  //Renderizzo l'errore
  if (error) {
    return (
      <div className="card bookings-card">
        <div className="card-body text-center py-5">
          <div className="alert alert-danger">Errore: {error}</div>
          <button className="btn btn-outline-danger" onClick={() => fetchBookings(currentPage)}>
            Ricarica
          </button>
        </div>
      </div>
    );
  }

  //renderizzo la tabella con le prenotazioni

  return (
    <div className="card shadow-sm bookings-card">
      <div className="card-header text-white">
        <h5 className="mb-0"> Bookings</h5>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover bookings-table mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Condition</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {/* ORa ciclo tutti i bookings della pagina attuale */}
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td className="text-muted booking-id">{booking.bookingId}</td>

                  {/* Se l'ospite esiste, mostro nome e cognome */}
                  <td className="fw-semibold guest-name">
                    {booking.guest?.firstName} {booking.guest?.lastName}
                  </td>

                  <td>{booking.propertyName}</td>
                  <td>{booking.checkInDate}</td>
                  <td>{booking.checkOutDate}</td>
                  <td>
                    <span className={`badge status-${booking.status}`}>{booking.status}</span>
                  </td>
                  <td className="price-cell">€{booking.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Controlli di paginazione */}
      <div className="card-footer bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p className="text-muted mb-0">
            {/* Info aggiuntive */}
            Total reservations: <strong>{pagination?.totalItems}</strong>
          </p>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-success btn-sm pagination-btn" onClick={handlePrevious} disabled={currentPage === 1}>
              ⬅️ Previous
            </button>

            <span className="text-muted px-2">
              Page <strong>{pagination?.currentPage}</strong> di <strong>{pagination?.totalPages}</strong>
            </span>

            <button className="btn btn-outline-success btn-sm pagination-btn" onClick={handleNext} disabled={!pagination?.hasMore}>
              Next ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsTable;
