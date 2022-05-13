const express = require('express')
const app= express.Router()
const {authenticateUser, authorizePermissions} =require('../middleware/authentication')

const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
} = require('../controllers/userController')
const router = require('./authRoutes')

router.route('/').get(authenticateUser,authorizePermissions ('admin'), getAllUsers)

router.route('/showMe').get(showCurrentUser)

router.route('/updateUser').patch(updateUser)

router.route('/updateUserPassword').patch(updateUserPassword)



router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router