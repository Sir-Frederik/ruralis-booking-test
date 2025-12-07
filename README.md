# Ruralis Booking Dashboard – Case Study

Proposed solution for the Ruralis **"Full Stack Developer"** case study.

---

## The problem

The admin dashboard for booking management generates an error **HTTP 413 Payload Too Large** when the number of bookings grows above a certain threshold (e.g. more than 100).

This happens because:

1. The backend uses a **Scan** on DynamoDB to read all records in the date range.
2. Each booking is enriched with a separate query to the guest table (**N+1 problem**).
3. All reservations are returned in **a single JSON response**, without any server-side pagination.
4. The frontend applies **client-side only** pagination ('Array.slice(...)'), but is forced to download the entire dataset anyway.

**Consequence:** As the data grows, the JSON response becomes too large, resulting in the **HTTP 413** error, and the dashboard stops working.

---

## Solution

I've implemented a **server-side pagination** supported by a frontend that requests data page by page.

### Backend (Paginated API)

The endpoint `/api/bookings` now:

- returns only 'limit' results at a time (e.g. 10 or 50),
- accepts 'page' as the page number to load,
- includes pagination metadata (current page, total items, total number of pages, etc.) in the response.

### Frontend (React)

The frontend no longer requires the entire dataset, but only loads what is needed:

- makes calls like this:  
  `GET /api/bookings?page=1&limit=10`
- show data in table,
- on each click on "next page"/"previous" makes a new call to the backend.

**Advantages:**

- the payload size remains small,
- error **413** is deleted,
- the system scales smoothly as bookings increase.

---

## Tech Stack

| Layer    | Tecnologia                                |
| -------- | ----------------------------------------- |
| Backend  | Node.js + Express                         |
| Frontend | React + Vite                              |
| Database | In-memory data mock (DynamoDB simulation) |

> Note: In this case study I use mock data.  
> The API structure, however, matches what I would implement on AWS Lambda with DynamoDB in production.

---

## How to start the project

### Prerequisites

- Node.js (v18+)
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/Sir-Frederik/ruralis-booking-test
cd ruralis-test
```

> Note: The branch to use is 'main'.  
> The other branches are work/experimentation.

---

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The backend will be available at:  
`http://localhost:3001`

---

### 3. Start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:  
`http://localhost:5173`

---

## Implementation Details - Backend

The mock data is located in `backend/src/data/mockData.js`

- **guests**: guestId, first name, last name, email, phone
- **properties**: propertyId, name
- **bookings**: 150 randomly generated reservations (date, guestId, propertyName, status, prezzo totale, createdAt)

The main endpoint is:

```
GET http://localhost:3001/api/bookings?page=1&limit=10
```

### Parameters

- `page` – page number (base 1)
- `limit` – number of results per page

### Example JSON response

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

### Advantages

- the backend sends only the data needed for that page,
- the answer remains light and predictable,
- the structure lends itself easily to adding filters (`fromDate`, `toDate`, `status`, ecc.).

---

## Implementation details - Frontend

The frontend (React + Vite):

contains the component `BookingsTable.jsx`, that:

- fetch towards `/api/bookings?page=X&limit=Y`,
- manages local states: `bookings`, `pagination`, `isLoading`, `error`,
- show the table with data,
- exposes navigation buttons between pages.
  I don't use Redux: local state is sufficient for this scenario.
  I used Bootstrap to style.

---

## Connection to the original problem (AWS Lambda + DynamoDB)

The project concretely illustrates the solution to the case study problem:

In production:

- the logic would run on an AWS Lambda,
- data would be read from DynamoDB using 'Query' (avoiding Scan when possible),
- pagination uses 'Limit' + 'LastEvaluatedKey' (cursor-based pagination).

In this project:

- I use mock data,
- but the API has the same contract,
- the frontend is already compatible with a real paginated API.

This approach avoids the **HTTP 413 Payload Too Large** and makes the dashboard scalable.

---

## Author

**Federico Brunetti**

Project created as a case study for the Stage Full Stack Developer position at Ruralis.
