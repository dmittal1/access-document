import express from 'express';
import auth from '../../middleware/auth';

// User Model
import User from '../../models/user.model';

const router = express.Router();


// @route POST api/users
// @desc Register new user
// @access Public 

router.get('/', auth, (req, res) => {
    User.find()
        .sort({ register_date: -1 })
        .then(items => res.json(items))
});

export default router;