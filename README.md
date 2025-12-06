# Ruralis Booking Dashboard – Case Study

Soluzione proposta per lo study case **“Full Stack Developer”** di Ruralis.

---

## Il problema

La dashboard admin per la gestione delle prenotazioni genera un errore **HTTP 413 Payload Too Large** quando il numero di booking cresce oltre una certa soglia (es. più di 100).

Questo accade perché:

1. Il backend utilizza una **Scan** su DynamoDB per leggere tutti i record nell’intervallo di date.
2. Ogni booking viene arricchito con una query separata verso la tabella degli ospiti (**N+1 problem**).
3. Tutte le prenotazioni vengono restituite in **un’unica risposta JSON**, senza alcuna paginazione lato server.
4. Il frontend applica la paginazione **solo lato client** (`Array.slice(...)`), ma è costretto a scaricare comunque l’intero dataset.

**Conseguenza:** quando i dati crescono, la risposta JSON diventa troppo grande, generando l’errore **HTTP 413**, e la dashboard smette di funzionare.

---

## La soluzione

Ho implementato una **paginazione lato server** supportata da un frontend che richiede i dati pagina per pagina.

### Backend (API paginata)

L’endpoint `/api/bookings` ora:

- restituisce solo `limit` risultati per volta (es. 10 o 50),
- accetta `page` come numero della pagina da caricare,
- include nella risposta metadati di paginazione (pagina corrente, totale elementi, numero totale di pagine, ecc.).

### Frontend (React)

Il frontend non richiede più l’intero dataset, ma carica solo ciò che serve:

- effettua chiamate del tipo:  
  `GET /api/bookings?page=1&limit=10`
- mostra i dati in tabella,
- ad ogni click su “pagina successiva”/“precedente” effettua una nuova chiamata al backend.

**Benefici:**

- la dimensione del payload rimane contenuta,
- l’errore **413** viene eliminato,
- il sistema scala senza problemi all’aumentare delle prenotazioni.

---

## Tech Stack

| Layer    | Tecnologia                                  |
| -------- | ------------------------------------------- |
| Backend  | Node.js + Express                           |
| Frontend | React + Vite                                |
| Database | Mock data in memoria (simulazione DynamoDB) |

> Nota: in questo case study utilizzo dati mock.  
> La struttura dell’API corrisponde però a quella che implementerei su AWS Lambda con DynamoDB in produzione.

---

## Come avviare il progetto

### Prerequisiti

- Node.js (v18+)
- npm

---

### 1. Clona il repository

```bash
git clone https://github.com/Sir-Frederik/ruralis-booking-test
cd ruralis-test
```

---

### 2. Avvia il backend

```bash
cd backend
npm install
npm start
```

Il backend sarà disponibile su:  
`http://localhost:3001`

---

### 3. Avvia il frontend

In un nuovo terminale:

```bash
cd frontend
npm install
npm run dev
```

Il frontend sarà disponibile su:  
`http://localhost:5173`

---

## Dettagli implementativi – Backend

I dati mock si trovano in `backend/src/data/mockData.js`

- **guests**: guestId, nome, cognome, email, telefono
- **properties**: propertyId, nome
- **bookings**: 150 prenotazioni generate casualmente (date, guestId, propertyName, status, prezzo totale, createdAt)

L’endpoint principale è:

```
GET http://localhost:3001/api/bookings?page=1&limit=10
```

### Parametri

- `page` – numero pagina (base 1)
- `limit` – numero di risultati per pagina

### Esempio di risposta JSON

```json
{
  "bookings": [
    {
      "bookingId": "b1",
      "propertyName": "Villa Toscana - San Gimignano",
      "checkInDate": "2024-12-05",
      "checkOutDate": "2024-12-08",
      "status": "confirmed",
      "guest": {
        "guestId": "g1",
        "firstName": "Mario",
        "lastName": "Rossi"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasMore": true
  }
}
```

### Vantaggi

- il backend invia solo i dati necessari per quella pagina,
- la risposta rimane leggera e prevedibile,
- la struttura si presta facilmente ad aggiungere filtri (`fromDate`, `toDate`, `status`, ecc.).

---

## Dettagli implementativi – Frontend

Il frontend (React + Vite):

- contiene il componente `BookingsTable.jsx`, che:
  - effettua la fetch verso `/api/bookings?page=X&limit=Y`,
  - gestisce gli stati locali: `bookings`, `pagination`, `isLoading`, `error`,
  - mostra la tabella con i dati,
  - espone pulsanti di navigazione tra le pagine.
- Non utilizzo Redux: lo stato locale è sufficiente per questo scenario.

---

## Collegamento con il problema originale (AWS Lambda + DynamoDB)

Il progetto illustra concretamente la soluzione al problema del case study:

In produzione:

- la logica verrebbe eseguita su una AWS Lambda,
- i dati verrebbero letti da DynamoDB usando `Query` (evitando Scan quando possibile),
- la paginazione utilizza `Limit` + `LastEvaluatedKey` (cursor-based pagination).

In questo progetto:

- uso mock data,
- ma l’API ha lo stesso contratto,
- il frontend è già compatibile con una API reale paginata.

Questo approccio evita l’**HTTP 413 Payload Too Large** e rende scalabile la dashboard.

---

## Autore

**Federico Brunetti**

Progetto realizzato come case study per la posizione di Stage Full Stack Developer presso Ruralis.
