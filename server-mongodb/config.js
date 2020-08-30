import  express from 'express';
import mongoose, { mongo } from 'mongoose';
import config from 'config';
//require('dotenv').config();

const app = express();

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to Mongo

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    }) // Adding new mongo url parser
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Use Routes

app.use('/api/documents', require('./routes/api/documents'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));



