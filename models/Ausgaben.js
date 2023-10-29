const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const ausgabenSchema = new mongoose.Schema({
    userAusgaben: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'   
    },
    expenseName: {
        type: String,
        required: true
    },
    valueAusgaben:{
        type: Number,
        required: true
    },
    textAusgaben: {
        type: String,
        default: "",
        required: false
    },
    boughtDate: {
        type: Date,
        default: Date.now(),
        required: false
    },/*
    completed: {
        type: Boolean,
        default: false
    }*/
},
{
    timestamps: true
}
)

ausgabenSchema.plugin(AutoIncrement,{
    inc_field: 'ticket',
    id: 'AusgabeTicketNums',
    start_seq: 300
})

module.exports = mongoose.model('Ausgaben', ausgabenSchema)
