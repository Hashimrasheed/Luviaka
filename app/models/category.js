const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {type: String, required: true},
    totalProducts: {type: Number}
})

module.exports = mongoose.model('Category', categorySchema)