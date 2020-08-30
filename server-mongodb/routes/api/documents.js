import express from 'express';
import auth from '../../middleware/auth';

// Document Model
import Document from '../../models/document.model';
import router from './auth';

const router = express.Router();

// @route GET api/Documents
// @desc Get All Documents
// @access Public 

router.route('/').get((req, res) => {
    Document.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
});

// @route POST api/Documents
// @desc Create a Document 
// @access Private 

router.route('/add').post(auth, (req, res) => {
    const newDocument = new Document({
        title: req.body.title,
        access: req.body.access,
        content: req.body.content
    }) 

    newDocument
        .save()
        .then(document => res.json(document));
});

// @route POST api/Documents
// @desc Edit the document 
// @access Private 

router.route('/update/:id').post(auth, (req, res) => {
    Document.findById(req.params.id)
        .then(document => {
            document.title = req.body.title;
            document.access = req.body.access;
            document.content = req.body.content;

            document.save()
                .then(() => res.json('Document Updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
                .catch(err => res.status(400).json('Error: ' + err))
        });
});

// @route DELETE api/Document
// @desc Delete the document 
// @access Private 

router.route('/:id').delete(auth, (req, res) => {
    Document.findByIdAndDelete(req.params.id)
    .then(() => res.json('Document Deleted'))
    .catch(err => res.status(400).json('Error: ' + err))
});

export default router;