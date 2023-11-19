const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true    
    },
    password: {
        type: String,
        required: true
    },
    familie:{
        type: String,
        required: true,
        default: "test"
    }
    ,
    roles: {
        type: [String],
        default: ["Employee"]
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)
