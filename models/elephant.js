const mongoose = require('mongoose');

const ElephantSchema = mongoose.Schema({
    type: String,
    data: Buffer
});

module.exports = mongoose.model('Image', ElephantSchema);
