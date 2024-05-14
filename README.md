# Restaurant Reservation Tool

## Context
The restaurant-reservation-tool is a simple full-stack application using a Node/React/Express/PostgreSQL (NERP?) tech stack. It simulates a tool that would be used by hosting staff at a restaurant to create, cancel, search, and modify reservations to a restaurant.

The app is deployed here: https://restaurant-reservation-tool-frontend.onrender.com/

## How to Use (on your own machine)

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your PostgreSQL database instance (to simply test out the app, you only need one and should assign it to DATABASE_URL_DEVELOPMENT).
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.

For local instances of PostgreSQL, the following database URL formatting convention was helpful: postgresql://YourUserName:YourPassword@YourHostname:PORT/YourDatabaseName

## Features

### Client

#### View a dashboard of existing tables and reservations (paginated by date). Reservations can be assigned to tables and then "finished" from the assigned table.
![7](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/7d623cf0-1f96-47a6-8d3a-275b3cc5d110)

#### Create a new reservation
![3](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/2ba50eac-fc43-4ec4-99a5-fde13563cd56)

#### Edit an existing reservation
![5](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/c80b65ed-7160-46e7-ad20-9bb58264402b)

#### Search for an existing reservation by mobile number
![2](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/c8796c42-ff5c-4038-ba10-2ebfff0a39fd)

#### Create a new table
![6](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/d6985868-9d2f-4d53-9f96-d270fc787a40)

#### Seat a reservation at an available table
![4](https://github.com/thomaslesperance/restaurant-reservation-tool/assets/144936700/dabed510-2cee-4930-bda2-c77b9dd61054)

### API

To support the above client features, the api provides several basic CRUD functions at the following endpoints:

#### GET ./reservations

#### POST ./reservations

#### GET ./reservations/:reservation_id

#### PUT ./reservations/:reservation_id

#### PUT ./reservations/:reservation_id/status

#### GET ./tables

#### POST ./tables

#### PUT ./tables/:table_id/seat

#### DELETE ./tables/:table_id/seat
