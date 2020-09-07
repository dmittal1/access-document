import  express from 'express';
const app = express();
// Bodyparser Middleware
app.use(express.json());
//Import Routes
import userAuthRoute from './routes/api/authentication';
import documentRoute from './routes/api/documents';
import userRoute from './routes/api/users';
import con from'./config_mysql/config';


// Create tables if do not exist 

//Table: Documents

const documentsTable = `create table if not exists documents(
    'id' varchar(20) NOT NULL,
    'title' varchar(20) DEFAULT NULL,
    'access' varchar(10) DEFAULT NULL,
    'content' longtext DEFAULT NULL,
    'published_on' timestamp NOT NULL DEFAULT current_timestamp(),
    'user_id' varchar(20) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

// Table: Users
const usersTable = `create table if not exists users(
  'id' varchar(20) NOT NULL,
  'name' varchar(20) NOT NULL,
  'email' varchar(20) NOT NULL,
  'password' varchar(20) NOT NULL,
  'register_date' timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

// Create Table: Documents 
con.query(documentsTable, function(err, result){
    if(err) throw err;
    console.log("Table: Document Created");
});

// Create Table: Users
con.query(usersTable, function(err, result){
    if(err) throw err;
    console.log("Table: Users Created");
});



// Use Routes

app.use('/api/documents', documentRoute);
app.use('/api/authentication', userAuthRoute);
app.use('/api/users', userRoute);

const port = 3001 || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));



