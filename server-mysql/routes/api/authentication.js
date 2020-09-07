import express from 'express';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {registerValidation, loginValidation} from '../../validation/validation';
import con from '../../config_mysql/config';
import uniqid from 'uniqid';
const router = express.Router();

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const{ error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    con.query(`SELECT * FROM users WHERE email = ${req.body.email}`, function(err, result){
        if(err) throw err;
        if(result[0].email !== ""){
            return 0;
        }
    })
    .catch(() => res.status(400).send('Email already exists'))

    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    con.query(`INSERT INTO users (id, name, email, password, reigster_date) VALUES (${uniqid()}, ${req.body.name}, ${req.body.email}, ${hashedPassword})`, function(err, result){
        if(err)
            return result
    
        })
    .then(() => res.send("Inserted successfully into the database"))
    .catch((err) => res.status(400).send(err))
});

//LOGIN
router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    con.query(`SELECT * FROM users WHERE email = ${req.body.email}`, function(err, result){
        if(err) throw err;
        if(result[0].email == ""){
            return 0;
        }
    })
    .catch(() => res.status(400).send('Invalid Email'))

    //GET PASSWORD

    const getData =  con.query(`SELECT * FROM users WHERE email = ${req.body.email}`, function(err, result){
        if(err) throw err;
        return result;
        }
    )
     
    //CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, getData[0].password);
    if(!validPass) return res.status(400).send('Invalid Password');

    //Create and assign a token
    const token = jwt.sign({ _id: getData[0].id }, 'eqr3r3rd2');
    res.header('auth-token', token).send(token);
})

export default router;