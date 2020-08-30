import express from 'express';
import bcrpyt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';

// User Model
import User from '../../models/user.model';

// @route POST api/auth
// @desc Auth user
// @access Public

router.post('/', (req, res) => {
    const { email, password } = req.body;

    //Simple Validation
    if(!email || !password){
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for exisiting user
    User.findOne({ email })
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'User Does not exist' });

            // Validate Password
            bcrpyt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' })

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                })
        })
})

// @route GET api/auth/user
// @desc Get user data
// @access Private

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
});

export default router;