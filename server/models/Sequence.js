const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxBookId: { type: Number, required: true }, 
});

module.exports = mongoose.model('Sequence', sequenceSchema);