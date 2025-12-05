import { useState, useEffect } from "react";

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
    return <p> Caricamento Prenotazioni... ⏳</p>;
  }

  //Renderizzo l'errore
  if (error) {
    <div>
      {" "}
      <p> Errore: {error}</p>
      <button onClick={() => fetchBookings(currentPage)}> Ricarica </button>
    </div>;
  }

  //renderizzo la tabella con le prenotazioni

  return (
    <div>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th> ID</th>
            <th> Ospite</th>
            <th> Proprietà</th>
            <th> Check-in</th>
            <th> Check-out</th>
            <th> Stato</th>
            <th> Prezzo</th>
          </tr>
        </thead>

        <tbody>
          {/* ORa ciclo tutti i bookings della pagina attuale */}
          {bookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>

              {/* Se l'ospite esiste, mostro nome e cognome */}
              <td>
                {booking.guest?.firstName} {booking.guest?.lastName}
              </td>

              <td>{booking.propertyName}</td>
              <td>{booking.checkInDate}</td>
              <td>{booking.checkOutDate}</td>
              <td>{booking.status}</td>
              <td>€{booking.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 🔢 Controlli di paginazione */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          ⬅️ Precedente
        </button>

        <span style={{ margin: "0 15px" }}>
          Pagina {pagination?.currentPage} di {pagination?.totalPages}
        </span>

        <button onClick={handleNext} disabled={!pagination?.hasMore}>
          Successiva ➡️
        </button>
      </div>

      {/* Info aggiuntive */}
      <p>Totale prenotazioni: {pagination?.totalItems}</p>
    </div>
  );
}

export default BookingsTable;
