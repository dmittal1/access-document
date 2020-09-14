import express from 'express';
import auth from '../../middleware/auth';
import jwt_decode from 'jwt-decode';

// Document Model
import Document from '../../models/document.model';
//import router from './auth';

const router = express.Router();

// @route GET  api/Documents
// @desc Get all Documents
// @access Public

router.get('/', auth, (req, res) => {
    Document.find()
        .sort({ published_on: -1 })
        .then(items => res.json(items))
})

// @route GET api/Documents
// @desc Get All USERS Documents
// @access Public 

router.get('/myDocuments', auth, (req, res) => {
    Document.find({ user_id:  jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id})
        .sort({ published_on: -1 })
        .then(items => res.json(items))
});

// @route POST api/Documents
// @desc Create a Document  
// @access Private 

router.post('/add', auth, (req, res) => {
    const newDocument = new Document({
        title: req.body.title,
        access: req.body.access,
        content: req.body.content,
        user_id: jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id
    }) 

    newDocument
        .save()
        .then(document => res.json(document));
});

// @route POST api/Documents
// @desc Edit the document 
// @access Private 

router.post('/update/:id', auth, (req, res) => {
    Document.findById(req.params.id).and({ user_id: jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id })
        .then(document => {
            document.title = req.body.title;
            document.access = req.body.access;
            document.content = req.body.content;

            document.save()
                .then(() => res.json('Document Updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
                .catch(err => res.status(400).json('Error: ' + err))
        })
         .catch(err => res.status(400).json("Error, insufficient privileges (Check User Id): " + err))
});

// @route DELETE api/Document
// @desc Delete the document 
// @access Private 

router.delete('/:id', auth, (req, res) => {

    Document.findOne({ _id: req.params.id }, function(error, document){
        if(document.user_id == jwt_decode(req.header('auth-token'), 'eqr3r3rd2')._id){
            document.remove();
            return true;
        }
            return false;
    }) 
      .then(() => res.json("Document Deleted"))
      .catch(() => res.status(400).json("Can not delete document"))
});

export default router;