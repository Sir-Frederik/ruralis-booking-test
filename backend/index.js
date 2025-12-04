// index.js
const express = require("express");
const cors = require("cors");
const { bookings, guests } = require("./src/data/mockData");

const app = express();
const PORT = 3001;

//Midlleware
app.use(cors());
app.use(express.json());

// Endpoint di test
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// ENDPOINT: GET /api/bookings
app.get(`/api/bookings`, (req, res) => {
  // Leggo i parametri della query  dall'url
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  console.log(`Richiesta PAGE ${page}, LIMIT ${limit}`);

  //calcolo gli indici per la prenotazione

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Estraggo le prenotazioni dalla pagina

  const paginatedBookings = bookings.slice(startIndex, endIndex);

  // prendo la prenotazione e le arricchisco attribuendo il relativo cliente
  const enrichedBookings = paginatedBookings.map((booking) => {
    const guest = guests.find((g) => g.guestId === booking.guestId);
    return {
      ...booking,
      guest: guest || null,
    };
  });

  // preparo la risposta Json con le informazioni della paginazione
  const response = {
    bookings: enrichedBookings,
    pagination: {
      currentPage: page,
      perPage: limit, //50
      totalItems: bookings.length,
      totalPages: Math.ceil(bookings.length / limit), //arrotondo per eccesso
      hasMore: endIndex < bookings.length,
    },
  };
  console.log(`Risposta: ${enrichedBookings.length} prenotazioni (pagina ${page}/${response.pagination.totalPages})`);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Caricati ${bookings.length} prenotazioni e ${guests.length} clienti`);
});
