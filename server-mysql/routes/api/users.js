import express from 'express';
import auth from '../../middleware/auth';
import * as command from '../../config_mysql/SQL';

const router = express.Router();


// @route POST api/users
// @desc Register new user
// @access Public 

router.get('/', auth, async (req, res) => {
    
    try{
        const result = command.getAllUsers();
        return res.send(result);
    }
    catch(err){
        return res.status(400).send(err.message);
    }
});

export default router;