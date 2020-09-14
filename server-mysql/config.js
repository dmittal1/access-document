import  express from 'express';
const app = express();
// Bodyparser Middleware
app.use(express.json());
//Import Routes
import userAuthRoute from './routes/api/authentication';
import documentRoute from './routes/api/documents';
import userRoute from './routes/api/users';
import * as command from './config_mysql/SQL';

// Connect to the database

command.connect();
command.connectAndVerifyTables();



// Use Routes

app.use('/api/documents', documentRoute);
app.use('/api/authentication', userAuthRoute);
app.use('/api/users', userRoute);

const port = 3001 || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));



