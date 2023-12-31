const User = require('../models/User')
const Note = require('../models/Note')
//const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt') //Keeps password crypted

// @desc Get all users
// @route Get /users
// @access Private
//const getAllUsers = asyncHandler(async (req, res) => { // Before Refactoring
const getAllUsers = async (req, res) => {    
    const users = await User.find().select('-password').lean() //lean is for don't give more data than needed, only json
    if(!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
}

// @desc Create new user
// @route Post /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles, familie } = req.body
    
    // Confirm data
    // if (!username || !password || !Array.isArray(roles) || !roles.length) { // before refactoring
    if (!username || !password || !familie) {
        // Status 400 stands for bad request
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).collation({ 
        locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        // Status 409 stands for conflict
        return res.status(409).json( {message: 'Duplicate username'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password,10) // salt rounds

//    const userObject = {
//         username,
//         "password": hashedPwd,
//          roles
//   }

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd, familie }
        : { username, "password": hashedPwd, roles, familie}

    // Create and store new user
    const user = await User.create(userObject)

    if(user){ //Created
        res.status(201).json({ message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, username, roles, active, password, familie } = req.body

    // Confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || !familie ||
    typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).collation({ 
        locale: 'en', strength: 2 }).lean().exec()
    // Allow updates to the original user
    if ( duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.active = active
    user.familie = familie

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`})

}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    if(!id) {
        return res.status(400).json({message: 'User ID required'})
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note){
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)    
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

