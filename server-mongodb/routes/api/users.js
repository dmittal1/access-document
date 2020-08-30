import express from 'express';
import bcrpyt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

// User Model
import User from '../../models/user.model';

const router = express.Router;


// @route POST api/users
// @desc Register new user
// @access Public 

router.route('/').post((req, res) => {
    const { name, email, password } = req.body;

    //Simple Validation 
    if(!name || !email || !password){
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    // Check for existing user

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg: 'User already exists' });
        
            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash 
            bcrpyt.genSalt(10, (err, salt) => {
                bcrpyt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        user:{
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    })
                                }
                            )
                        })
                })
            })
        })
});

export default router;