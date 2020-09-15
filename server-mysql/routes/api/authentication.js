import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {registerValidation, loginValidation} from '../../validation/validation';
import * as command from '../../config_mysql/SQL';
import uniqid from 'uniqid';
const router = express.Router();

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const{ error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //Checking if the user is already in the database
        await command.checkUserDoesNotExist(req.body.email);
        //Hash Passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Insert to the database
        var values = [
            [uniqid(), req.body.name, req.body.email, hashedPassword]
        ]
        // Save User
        await command.insertUser([values]);
        return res.send("User Registered");
    }
    catch(err){
        return res.status(400).send(err);
    }

});

//LOGIN
router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
    //Checking if the email exists
    const result = await command.getUserByEmail(req.body.email);
    // Check Password
    const validPass = await bcrypt.compare(req.body.password, result[0].password);
    if(!validPass) return res.status(400).send('Invalid Password');
    //Assign token
    const token = jwt.sign({ _id: result[0].id }, 'eqr3r3rd2');
    return res.header('auth-token', token).send(token);

    }
    catch(err){
        return res.status(400).send(err.message);
    }
})

//LOGOUT
router.post('/logout', async (req, res) => {
    return res.header('auth-token', '').send('Logged Out');
})

export default router;