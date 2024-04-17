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

const AdminModel = require('../models/Admin');
const UserModel = require('../models/User');

const {checkAdminSession, verifyToken} = require('../middlewares/auth');


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
        res.json(await AdminModel.find().populate('User'));
    } catch (error) {
        console.error("Error while fetching admin list:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});



//---------------------------------------------------------------------------
//edit admin
// Render form for editing a specific admin
router.get('/edit/:id', checkAdminSession, async (req, res) => {
    try {
        // Fetch admin details by ID
        const adminId = req.params.id;
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            throw new Error('Admin not found');
        }

        // Fetch user details by ID
        const userId = admin.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        res.json(admin, user);

    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.status(404).json({ success: false, error: "Admin not found" });
    }
});

// Handle form submission for editing an admin
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch admin by ID
        const adminId = req.params.id;
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            throw new Error('Admin not found');
        }
        // Fetch user details by ID
        const userId = admin.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update admin details
        admin.name = req.body.name;
        admin.dob = req.body.dob;
        admin.gender = req.body.gender;
        admin.address = req.body.address;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            admin.image = imageData.toString('base64');
        }
        await admin.save();

        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, salt);
        await user.save();

        // Send success JSON response
        res.json({ success: true, message: "Admin updated successfully" });
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
            console.error("Error while updating admin:", err);
            res.json({ success: false, error: "Internal Server Error" });
        }
    }
});

router.get('/profile', async (req, res) => {
    try{
        var adminUserId = req.session.user_id;
        var UserData = await UserModel.findById(adminUserId);
      if(UserData){
        var adminID = req.session.admin_id;
        var AdminData = await AdminModel.findById(adminID);
      } else {
        res.status(500).json({ success: false, error: "Profile not found" });
      }
      res.status(200).json({ success: true, message: "Render edit marketing manager form", UserData, AdminData });
    }catch(error){
        console.error("Error while fetching Admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/editAdmin/:id', async (req, res) => {
    const adminId = req.params.id;
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
        res.status(404).json({ success: false, error: "Admin not found" });
        return;
    }
    // Fetch user details by ID
    const userId = admin.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    if(userId == req.session.user_id && adminId == req.session.admin_id){
        try {
            res.status(200).json({ success: true, message: "Render add marketing manager form", admin, user });
        } catch (error) {
            console.error(error);
            res.status(404).send('Admin not found');
        }
    } else {
        res.status(404).send('Admin not found');
    }
    
});

router.post('/editAdmin/:id', upload.single('image'), async (req, res) => {
    const adminId = req.params.id;
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
        res.status(404).json({ success: false, error: "Admin not found" });
        return;
    }
    // Fetch user details by ID
    const userId = admin.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    if(userId == req.session.user_id && adminId == req.session.admin_id){
        try {
            // Update marketingmanager details
            admin.name = req.body.name;
            admin.dob = req.body.dob;
            admin.gender = req.body.gender;
            admin.address = req.body.address;
            // If a new image is uploaded, update it
            if (req.file) {
                const imageData = fs.readFileSync(req.file.path);
                admin.image = imageData.toString('base64');  
            } 
            await admin.save();
            
            user.password = bcrypt.hashSync(req.body.password, salt);
            await user.save();
    
            res.status(200).json({ success: true, message: "Update my Admin data success" });
        } catch (err) {
            if (err.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in err.errors) {
                  InputErrors[field] = err.errors[field].message;
               }
               console.error("Error while updating admin:", err);
                res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
            }
         }
    } else {
        res.status(404).send('Admin not found');
    }
   
});

module.exports = router;
