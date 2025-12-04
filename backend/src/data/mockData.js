// GUESTS (Ospiti)

const guests = [
  { guestId: "g1", firstName: "Pinco", lastName: "Pallo", email: "pinco.pallo@email.com", phone: "+39 333 1234567" },
  { guestId: "g2", firstName: "Bianca", lastName: "Bianchi", email: "Bianca.b@email.com", phone: "+39 340 2345678" },
  { guestId: "g3", firstName: "Aldo", lastName: "Baglio", email: "Aldo.Baglio@email.com", phone: "+1 555 1234567" },
  { guestId: "g4", firstName: "Emma", lastName: "Mueller", email: "emma.m@email.de", phone: "+49 170 1234567" },
  { guestId: "g5", firstName: "Giovanni", lastName: "Storti", email: "Giovanni.s@email.fr", phone: "+33 6 12345678" },
  { guestId: "g6", firstName: "Marco", lastName: "Cesaroni", email: "marco.c@email.com", phone: "+39 347 3456789" },
  { guestId: "g7", firstName: "Anna", lastName: "Kowalski", email: "anna.k@email.pl", phone: "+48 501 234567" },
  { guestId: "g8", firstName: "Giacomo", lastName: "Poretti", email: "Giacomo.p@email.es", phone: "+34 612 345678" },
  { guestId: "g9", firstName: "Max", lastName: "Pezzali", email: "max.p@email.jp", phone: "+88 388 38838838" },
  { guestId: "g10", firstName: "Giulia", lastName: "Ferrari", email: "giulia.f@email.com", phone: "+39 351 4567890" },
];

// ============================================
// PROPERTIES (Proprietà)
// ============================================
const properties = [
  { propertyId: "p1", name: "Casa del Borgo - Civita di Bagnoregio" },
  { propertyId: "p2", name: "Villa Toscana - San Gimignano" },
  { propertyId: "p3", name: "Trullo Magico - Alberobello" },
  { propertyId: "p4", name: "Casale dei Limoni - Amalfi" },
  { propertyId: "p5", name: "Dimora Storica - Matera" },
  { propertyId: "p6", name: "Cascina Piemonte - Langhe" },
  { propertyId: "p7", name: "Casa sul Mare - Cinque Terre" },
  { propertyId: "p8", name: "Palazzo Antico - Orvieto" },
  { propertyId: "p9", name: "Rifugio Montano - Dolomiti" },
  { propertyId: "p10", name: "Masseria Pugliese - Ostuni" },
];

const statuses = ["confirmed", "pending", "cancelled", "completed"];

// ============================================
// FUNZIONE: Genera data casuale nel range
// ============================================
function randomDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0]; // converto la data in UTC e la splitto  prendendo solo il formato: "2024-12-05"
}

// ============================================
// FUNZIONE: Genera bookings
// ============================================
function generateBookings(count) {
  const bookings = [];

  for (let i = 1; i <= count; i++) {
    // Check-in random tra -7 e +7 giorni da oggi
    const checkInOffset = Math.floor(Math.random() * 15) - 7;
    const stayDuration = Math.floor(Math.random() * 5) + 2; // 2-7 notti

    const guest = guests[Math.floor(Math.random() * guests.length)];
    const property = properties[Math.floor(Math.random() * properties.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    bookings.push({
      bookingId: `b${i}`,
      guestId: guest.guestId,
      propertyId: property.propertyId,
      propertyName: property.name,
      checkInDate: randomDate(checkInOffset),
      checkOutDate: randomDate(checkInOffset + stayDuration),
      status: status,
      totalPrice: Math.floor(Math.random() * 900) + 100, // €100-€1000
      createdAt: randomDate(checkInOffset - 30), // Prenotato ~30gg prima
    });
  }

  // Ordina per data check-in
  return bookings.sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
}

// ============================================
// GENERO 150 BOOKINGS (per simulare il problema!)
// ============================================
const bookings = generateBookings(150);

// ============================================
// EXPORTS
// ============================================
module.exports = {
  bookings,
  guests,
  properties,
};
