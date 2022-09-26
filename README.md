<h1 align="center">
  Sing me a Song
</h1>

# Description

Sing me a song is an application for anonymous song recommendation. However, the goal here was test development.

</br>

## Environment Variables

On .env file (front-end):

`REACT_APP_API_BASE_URL = http://localhost:5000`

On .env file (back-end)

`DATABASE_URL = postgres://user:password@host:5432/database`

`NODE_ENV="prod"`

On .env.test file (back-end folder):

`DATABASE_URL = postgres://user:password@host:5432/database_test`

`NODE_ENV="test"`

## Test Locally

Clone the project

```bash
  git clone https://github.com/phbodias/Sing-Me-a-Song.git
```

Install dependencies


```bash
  npm install
```

Create database
```bash
  npx prisma migrate dev
```

To run integration tests

```bash
  npm run test:integration
```

To run unit tests

```bash
  npm run test:unit
```

To run E2E tests:

In the back-end directory and start the server

```bash
  npm run dev
```

In the front-end directory and start the server

```bash
  npm start
```

In another front-end directory open the Cypress

```bash
  npx cypress open
```
