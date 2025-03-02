const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    Products:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Product'
        }
    ],
    total:{
        type:Number,
    }
})

const Cart = mongoose.model('cart',cartSchema);

module.exports = {Cart}