const { bookings, guests } = require("./data/mockData");
console.log(`Generate ${bookings.length} prenotazioni`);
console.log(`Generati ${guests.length} clienti`);
console.log(`\n Prime 3 prenotazioni:`);
console.log(bookings.slice(0, 3));
