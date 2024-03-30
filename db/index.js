const pg = require('pg');
const client = new pg.Client(`postgres://localhost/acme_reservation_planner_db`);
const uuid = require ('uuid');

const createTables = async () => {
//drop tables
const SQL = /*SQL*/ `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS resturants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    CREATE TABLE resturants(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES customers(id) NOT NULL,
        resturant_id UUID REFERENCES resturants(id) NOT NULL
        
    );
    
`
await client.query(SQL);
};

const createCustomer = async (name) => {
    const SQL = /*SQL*/ `INSERT INTO customers(id, name) VALUES ($1, $2) RETURNING *`
    const response = await client.query(SQL, [uuid.v4(), name])
console.log('response-customers', response);
return response.rows[0];
}
;

const createResturant = async (name) => {
    const SQL = /*SQL*/ `INSERT INTO resturants(id, name) VALUES ($1, $2) RETURNING *`
    const response = await client.query(SQL, [uuid.v4(), name])
console.log('response -resturants', response.rows[0])
return response.rows[0];
}

const createReservation = async ({customer_id, resturant_id}) => {
    const SQL= /*SQL*/ `
    INSERT INTO vacations(id, customer_id, resturant_id) VALUES($1, $2, $3) RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), customer_id, resturant_id]);
    return response.rows[0]
}

const seed = async () => {
    await Promise.all([
        createCustomer('meg'),
        createCustomer('jeff'),
        createResturant('Pizza Hut'),
        createResturant('Food Place')
    ])
    const customers = await fetchCustomers()
    console.log('Customers are ', await fetchCustomers());
    const resturants = await fetchResturants()
    console.log('Resturants are ', await fetchResturants());
    await Promise.all([
        createReservation({
            customer_id: customers[0].id,
            resturant_id: resturants[1].id
        }),
        createReservation({
            customer_id: customers [1].id,
            resturant_id: resturants[0].id
        }),
    ])
    console.log('Reservations are: ', await fetchReservations());
};

const fetchCustomers = async () => {
    const SQL = /*SQL*/ `
    SELECT * from customers;
    `
    const response = await client.query(SQL);
    return response.rows;
}

const fetchResturants = async () => {
    const SQL = /*SQL*/ `
    SELECT * from resturants;
    `
    const response = await client.query(SQL);
    return response.rows;
}

const fetchReservations = async () => {
    const SQL = /*SQL*/ `
    SELECT * from reservations;
    `
    const response = await client.query(SQL)
    return response.rows;
}

module.exports = {
    client,
    createTables,
    createReservation,
    createCustomer,
    createResturant,
    fetchCustomers,
    fetchResturants,
    fetchReservations,
    seed
}