# DantisApp

A billing application with a product catalogue, cart, tax handling and invoice
generation, built as an Angular single-page app over an Express and MongoDB API.

## Stack

| Layer | Technology | Location |
| --- | --- | --- |
| Frontend | Angular | `dantisApp/ngdantis` |
| API | Node.js, Express | `dantisApp` |
| Database | MongoDB (Mongoose) | `dantisApp/DB` |

## Features

- Product management with create, read, update and delete on the admin side
- Product listing with filtering by product code
- Seller pages for browsing the catalogue
- Cart with tax calculation
- Invoice generation, persisted to MongoDB
- User registration and login

## Project structure

```text
dantisApp/
|-- Api/              REST route handlers (product, user)
|-- DB/               Mongoose models and connection
|   |-- connection.js
|   |-- invoice.js
|   |-- paymode.js
|   |-- product.js
|   |-- tax.js
|   `-- user.js
|-- index.js          API entry point
`-- ngdantis/         Angular application
    `-- src/app/      dashboard, invoice, login, nav-bar, seller-page, user
```

## Running locally

Both the API and the frontend need to be running. MongoDB must be reachable by
the connection settings in `dantisApp/DB/connection.js`.

Start the API:

```bash
cd dantisApp
npm install
npm run server
```

Start the Angular frontend:

```bash
cd dantisApp/ngdantis
npm install
ng serve --open
```

## Licence

MIT. See [LICENSE](LICENSE).
