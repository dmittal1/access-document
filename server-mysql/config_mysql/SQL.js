import mysql from 'mysql';


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "access-document"
})


// Create tables if do not exist 

//Table: Documents

const documentsTable = `create table if not exists documents(
        id  varchar(40) NOT NULL,
        title varchar(40) DEFAULT NULL,
        access varchar(40) DEFAULT NULL,
        content longtext DEFAULT NULL,
        published_on timestamp NOT NULL DEFAULT current_timestamp(),
        user_id varchar(40) DEFAULT NULL,
        PRIMARY KEY(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

// Table: Users
const usersTable = `create table if not exists users(
  id varchar(40) NOT NULL,
  name varchar(40) NOT NULL,
  email varchar(40) NOT NULL,
  password varchar(100) NOT NULL,
  register_date timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

export function connect(){
    return con.connect(function(err){
        if(err) throw err;
    });
}

// Create Table: Documents
export async function createDocuments(){ 
    return con.query(documentsTable, function(err, result){
        if(err) throw err;
    });
}

// Create Table: Users
export async function createUsers(){
    return con.query(usersTable, function(err, result){
        if(err) throw err;
    });
}

// Users - Commands
export async function getAllUsers() {
    return new Promise(function(resolve, reject){
        con.query(`SELECT * FROM users WHERE 1`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.length == 0) { return reject("No Users Available") };
            return resolve(result);
    })
})
}


export async function getUserByEmail(email){
    return new Promise(function(resolve, reject){
        con.query(`SELECT * FROM users WHERE email = ${con.escape(email)}`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.length == 0) { return reject("User does not exist with that email") };
            return resolve(result);
        });
    });
}

export async function checkUserExist(email){
    return new Promise(function(resolve, reject){
        con.query(`SELECT * FROM users WHERE email = ${con.escape(email)}`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.length == 0) { return reject("User does not exist with that email") };
            return resolve(result);
        });
    });
}

export async function checkUserDoesNotExist(email){
    return new Promise(function(resolve, reject){
        con.query(`SELECT * FROM users WHERE email = ${con.escape(email)}`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.length !== 0) { return reject("User already exist with that email") };
            return resolve(result);
    })
 
})
}

// Document Commands 

export async function insertUser(data){
    return new Promise(function(resolve, reject){
        con.query("INSERT INTO users (id, name, email, password) VALUES ?", data, function(err, result){
            if(err) { return reject(err.message) };
            if(result.affectedRows == 0) { return reject("User couldn't be saved") };
            return resolve("User has been saved successfully");
        });
    });
}

export async function insertDocument(data){
    return new Promise(function(resolve, reject){
        con.query("INSERT INTO documents (id, title, access, content, user_id) VALUES ?", data, function(err, result){
            if(err) { return reject(err.message) };
            if(result.affectedRows == 0) { return reject("Document couldn't be saved") };
            return resolve("Document have been saved successfully")
        });
    });
}

export async function updateDocument(id, data){
    return new Promise(function(resolve, reject){
        con.query(`UPDATE documents SET title = '${data.title}', access = '${data.access}', content = '${data.content}' WHERE id = '${id}'`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.affectedRows !== 1) { return reject("Document can not be updated") };
            return resolve("Document has been Updated"); 
    });
})
}

export async function deleteDocument(id){
    return new Promise(function(resolve, reject) {
        con.query(`DELETE FROM documents WHERE id = '${id}'`, function(err, result){
            if(err) { return reject(err.message) };
            if(result.affectedRows !== 1) { return reject("Document can not be deleted")};
            return resolve("Document Deleted"); 
        });
    })
}

export async function getMyDocuments(id){
    return new Promise(function(resolve, reject){
        con.query(`SELECT * FROM documents where user_id = '${id}' ORDER BY published_on DESC`, function(err, result){
            if(err) { return reject(err.message) };
            return resolve(result);
        })
    })
 
}

export async function getAllDocuments(){
    return new Promise(function(resolve, reject) {
        con.query(`SELECT * FROM documents ORDER BY published_on DESC`, function(err, result, fields) {
            if(err) { return reject(err.message); }
            return resolve(result);
        })
        
    })
}

export async function searchDocuments(keyWord){
    return new Promise(function(resolve, reject) {
        con.query(`SELECT * FROM documents WHERE title LIKE '${keyWord}%' ORDER BY published_on DESC`, function(err, result, fields) {
            if(err) { return reject(err.message); }
            return resolve(result);
        })
        
    })
}

export async function getDocumentById(id){
    return new Promise(function(resolve, reject){
     con.query(`SELECT * FROM documents WHERE id = '${id}'`, function(err, result){
        if(err) { return reject(err.message) };
        if(result.length == 0) { return reject("Document does not exist")};
        return resolve(result);
    })
})
}




export async function connectAndVerifyTables(){
    try {
        await createDocuments();
        await createUsers();
    } 
    catch(err){
        console.log(`Error: ${err.message}`);
    }
    console.log("Connected to Database");
    console.log("Tables created or verified successfully");
}


