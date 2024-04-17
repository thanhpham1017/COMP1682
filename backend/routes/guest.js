const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const router = require("express").Router();
const GuestModel = require('../models/guest');
const UserModel = require('../models/User');


const {checkAdminSession, checkGuestSession, verifyToken} = require('../middlewares/auth');

const salt = bcrypt.genSaltSync(10);
const secret = 'bnxbcvxcnbvvcxvxcv';

// //-------------------------------------------------------------------------
// // Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/'); // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()); // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });

//-----------------------------------------------------------------------------------------------
//for Admin
//------------------------------------------------------------------------
// Route to get all admins
router.get('/', async (req, res) => {
    try {
        res.json(await GuestModel.find().populate('User'));
    } catch (error) {
        console.error("Error while fetching guest list:", error);
        res.json({ success: false, error: "Internal Server Error" });
    }
});


router.get('/add', async (req, res) => {
    try{
        res.status(200).json({ success: true, message: "Render add guest form"});
    }catch(error){
        console.error("Error while adding Guest list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    //get value by form : req.body
    try{
        const name = req.body.name;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const address = req.body.address;
        const image = req.file

        const email = req.body.email;
        const password = req.body.password;
        const hashPassword = bcrypt.hashSync(password, salt);
        const role = ''; //objectID
      
        //read the image file
        const imageData = fs.readFileSync(image.path);
        //convert image data to base 64
        const base64Image = imageData.toString('base64');

        
        //create users then add new created users to user field of collection marketing_manager
        const availableUser = await UserModel.findOne({email: email});
        if(availableUser){
            res.status(500).json({ success: false, error: "User existed"});
        } else {
            const users = await UserModel.create(
                {
                    email: email,
                    password: hashPassword,
                    role: role
                }
            );
            const newBlogger = await BloggerModel.create(
                {
                name: name,
                dob: dob,
                gender: gender,
                address: address,
                image: base64Image,
                user: users
                }
            );
            if(newBlogger){
                res.status(201).json({ success: true, message: "Blogger created successfully" });
            } else {
                res.status(500).json({ success: false, message: "Error Blogger created " });
            }
        }
        
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           console.error("Error while adding blogger:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
    
});


//---------------------------------------------------------------------------
//edit admin
// Render form for editing a specific admin
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch admin details by ID
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            throw new Error('Blogger not found');
        }

        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        res.json(guest, user);

    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.json({ success: false, error: "Guest not found" });
    }
});

// Handle form submission for editing an admin
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch admin by ID
        const guestId = req.params.id;
        const guest = await GuestModel.findById(guestId);
        if (!guest) {
            throw new Error('Guest not found');
        }
        // Fetch user details by ID
        const userId = guest.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update admin details
        guest.name = req.body.name;
        guest.dob = req.body.dob;
        guest.gender = req.body.gender;
        guest.address = req.body.address;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            guest.image = imageData.toString('base64');
        }
        await guest.save();

        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Send success JSON response
        res.json({ success: true, message: "Guest updated successfully" });
    } catch (err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            let InputErrors = {};
            for (let field in err.errors) {
                InputErrors[field] = err.errors[field].message;
            }
            res.json({ success: false, error: "Validation Error", InputErrors });
        } else {
            // Handle other errors
            console.error("Error while updating guest:", err);
            res.json({ success: false, error: "Internal Server Error" });
        }
    }
});

router.get('/profile', async (req, res) => {
    try{
        var guestUserId = req.session.user_id;
        var UserData = await UserModel.findById(guestUserId);
      if(UserData){
        var guestID = req.session.guest_id;
        var GuestData = await GuestModel.findById(guestID);
      } else {
        res.status(500).json({ success: false, error: "Profile not found" });
      }
      res.status(200).json({ success: true, message: "Render edit guest form", UserData, GuestData });
    }catch(error){
        console.error("Error while fetching Guest:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/editGuest/:id', async (req, res) => {
    const guestId = req.params.id;
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
        res.status(404).json({ success: false, error: "Guest not found" });
        return;
    }
    // Fetch user details by ID
    const userId = guest.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    if(userId == req.session.user_id && guestId == req.session.guest_id){
        try {
            res.status(200).json({ success: true, message: "Render add guest form", guest, user });
        } catch (error) {
            console.error(error);
            res.status(404).send('Guest not found');
        }
    } else {
        res.status(404).send('Guest not found');
    }
    
});

router.post('/editGuest/:id', upload.single('image'), async (req, res) => {
    const guestId = req.params.id;
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
        res.status(404).json({ success: false, error: "Guest not found" });
        return;
    }
    // Fetch user details by ID
    const userId = guest.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    if(userId == req.session.user_id && guestId == req.session.guest_id){
        try {
            // Update marketingmanager details
            guest.name = req.body.name;
            guest.dob = req.body.dob;
            guest.gender = req.body.gender;
            guest.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                guest.image = imageData.toString('base64');  
            } 
            await guest.save();
            
            user.password = bcrypt.hashSync(req.body.password, salt);
            await user.save();
    
            res.status(200).json({ success: true, message: "Update my Guest data success" });
        } catch (err) {
            if (err.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in err.errors) {
                  InputErrors[field] = err.errors[field].message;
               }
               console.error("Error while updating guest:", err);
                res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
            }
         }
    } else {
        res.status(404).send('Guest not found');
    }
   
});



module.exports = router;
