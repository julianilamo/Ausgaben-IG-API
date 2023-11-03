const User = require('../models/User')
const Ausgaben = require('../models/Ausgaben')

// @desc Get all ausgaben
// @route Get /ausgaben
// @access Private
const getAllAusgaben = async (req,res)=>{
    const ausgabens = await Ausgaben.find().lean()
    
    if(!ausgabens?.length){
        return res.status(400).json({ message: 'No ausgabens found'})
    }

    const ausgabensWithUser = await Promise.all(ausgabens.map(async(ausgaben)=>{
        const user = await User.findById(ausgaben.userAusgaben).lean().exec()
        return{...ausgaben, username: user.username}
    }))

    res.json(ausgabensWithUser)
}

// @desc Create new ausgaben
// @route POST /ausgaben
// @access Private
const createNewAusgaben = async (req,res)=>{
    const {userAusgaben, expenseName, valueAusgaben, textAusgaben, boughtDate} = req.body

    // Confirm fields required
    if(!userAusgaben || !expenseName || !valueAusgaben){
        return res.status(400).json({ message: 'Insuficient given data, All fields required'})
    }

    /*
    // Check for duplicate title
    const duplicate = await Note.findOne({title}).collation({ 
        locale: 'en', strength: 2 }).lean().exec()
    if(duplicate){
        return res.status(409).json({ message: 'Duplicate note title'})
    }
    */

    // Create and store the new ausgaben
    const ausgaben = await Ausgaben.create({userAusgaben, expenseName, valueAusgaben, textAusgaben, boughtDate})
    if(ausgaben){
        return res.status(201).json({ message: 'New ausgaben created'})
    } else {
        return res.status(400).json({ message: 'Invalid ausgaben data received'})
    }
}

// @desc Update one ausgaben
// @route PATCH /ausgaben
// @access Private
const updateAusgaben = async (req,res)=>{
    const {id, userAusgaben, expenseName, valueAusgaben, textAusgaben, boughtDate} = req.body

    // Check fields
    if(!id || !userAusgaben || !expenseName || !valueAusgaben){
        return res.status(400).json({ message: 'All fields are required'})
    }

    if(typeof boughtDate !== 'date'){
        return res.status(400).json({ message: 'date value is required'})
    }

    // Check if title exist
    const ausgaben = await Ausgaben.findById(id).exec()
    if(!ausgaben){
        return res.status(400).json({ message: 'Ausgaben not found' })
    }
/*
    // Check for duplicate title and note exist to update
    const duplicate = await Note.findOne({title}).collation({ 
        locale: 'en', strength: 2 }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Duplicate note title'})
    }
*/

    ausgaben.userAusgaben = userAusgaben
    ausgaben.expenseName = expenseName
    ausgaben.valueAusgaben = valueAusgaben
    ausgaben.textAusgaben = textAusgaben
    ausgaben.boughtDate = boughtDate

    const updateAusgaben = await ausgaben.save()

    res.json(`'${updateAusgaben.expenseName}' with new value: '${updateAusgaben.valueAusgaben}' has been updated`)
}

// @desc Delete one ausgaben
// @route DELETE /ausgaben
// @access Private
const deleteAusgaben = async (req,res)=>{
    const { id } = req.body
    
    // Confirm data
    if(!id){
        return res.status(400).json({ message: 'Id required'})
    }

    // Confirm ausgaben exists to delete
    const ausgaben = await Ausgaben.findById(id).exec()
    if (!ausgaben){
        return res.status(400).json({ message: 'Ausgaben not found'})
    }

    const result = await ausgaben.deleteOne()

    const reply = `Ausgaben '${updateAusgaben.expenseName}'  with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllAusgaben,
    createNewAusgaben,
    updateAusgaben,
    deleteAusgaben
}