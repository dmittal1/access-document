import  express from 'express';
import mongoose from 'mongoose';
const app = express();
// Bodyparser Middleware
app.use(express.json());
//Import Routes
import userAuthRoute from './routes/api/authentication';
import documentRoute from './routes/api/documents';
import userRoute from './routes/api/users';

// DB Config
//const db = config.get('access-document');

// Connect to Mongo

mongoose
    .connect('mongodb://localhost:27017/access-document', 
    { useNewURLParser: true }) // Adding new mongo url parser
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Use Routes

app.use('/api/documents', documentRoute);
app.use('/api/authentication', userAuthRoute);
app.use('/api/users', userRoute);

const port = 3001 || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));



