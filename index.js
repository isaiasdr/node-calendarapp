const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//create express app
const app = express();

//database connection
dbConnection();

//cors
app.use(cors());

//public folder
app.use( express.static( 'public' ) );

//lecture and parse body
app.use( express.json() );

//route handler
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/event'));

//listen for requests
app.listen( process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`);
});