require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const { client, createTables, seed } = require('./db')
const app = express();

//middlewear

app.use(express.json());
app.use(morgan('combined'))

app.use('/api', require('./api'))
//init function
const init = async () => {
    await client.connect();
    console.log('db connected');
    await createTables();
    console.log('tables created');
    await seed();
    console.log('database seeded');

    //process.env.PORT below where 3000 is
    app.listen(3000, () => {
        console.log(`server is listening on port ${process.env.PORT}`);
    });
};

init();