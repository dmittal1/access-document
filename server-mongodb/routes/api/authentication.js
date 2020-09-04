import express from 'express';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {registerValidation, loginValidation} from '../../validation/validation';
const router = express.Router();

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const{ error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists')

    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    
    } catch(err){
        res.status(400).send(err);    
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');
    //CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, 'eqr3r3rd2');
    res.header('auth-token', token).send(token);
})

export default router;