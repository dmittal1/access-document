import express from 'express';
import auth from '../../middleware/auth';
import jwt_decode from 'jwt-decode';
import * as command from '../../config_mysql/SQL';
import uniqid from 'uniqid';
//import router from './auth';
const router = express.Router();

// @route GET  api/Documents
// @desc Get all Documents
// @access Public

router.get('/', auth, async (req, res) => {
    
    try{
        const result = await command.getAllDocuments();
        return res.json(result);
    }
    catch(err){
        return res.status(400).send(err);
    }
})

// @route GET  api/Documents
// @desc Search Documents
// @access Public

router.get('/search/:keyWord', auth, async (req, res) => {
    
    try{
        const result = await command.searchDocuments(req.params.keyWord);
        return res.json(result);
    }
    catch(err){
        return res.status(400).send(err);
    }
})



// @route GET api/Documents
// @desc Get All USERS Documents
// @access Public 

router.get('/myDocuments', auth, async (req, res) => {

        const id = jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id;
        try{
            const result = await command.getMyDocuments(id)
            return res.send(result);
        }
        catch(err){
            return res.status(400).send(err);
        }
    })

// @route POST api/Documents
// @desc Create a Document  
// @access Private 


router.post('/add', auth, async (req, res) => {
    var values = [
        [
            uniqid(), 
            req.body.title,
            req.body.access,
            req.body.content,
            jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id
        ]
    ]

    try {
        const result = await command.insertDocument([values]);
        return res.send(result);
    }
    catch(err){
        return res.status(400).send(err);
    }
});

// @route POST api/Documents
// @desc Edit the document 
// @access Private 


router.post('/update/:id', auth, async (req, res) => {

    const loggedonId = jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id;
    try{
        const document = await command.getDocumentById(req.params.id);
        // Check if user has access to this document
        if (document[0].user_id !== loggedonId) return res.status(400).send("Insufficient Privileges, check user id");
        // Save updated document
        const result = await command.updateDocument(req.params.id, req.body);
        return res.send(result);
    }
    catch(err){
        return res.status(400).send(err);
    }
});

// @route DELETE api/Document
// @desc Delete the document 
// @access Private 

router.delete('/:id', auth, async (req, res) => {
    const loggedonId = jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id;

    try {
        const document = await command.getDocumentById(req.params.id);
        // Check if user has access to this document
        if (document[0].user_id !== loggedonId) return res.status(400).send("Insufficient Privileges, check user id");
        // Delete Document
        const result = await command.deleteDocument(req.params.id);
        return res.send(result);
    }
    catch(err){
        return res.status(400).send(err);
    }
});

export default router;