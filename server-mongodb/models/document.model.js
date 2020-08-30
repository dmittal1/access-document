import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema
const DocumentSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    access:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    published_on:{
        type: Date,
        default: Date.now
    }
})

export default Document = mongoose.model('document', DocumentSchema);