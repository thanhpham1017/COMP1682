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
const router = express.Router();

const BloggerModel = require('../models/Blogger');
const AccountModel = require('../models/Account');


const {verifyToken, checkBlogger, checkAdmin} = require('../middlewares/auth');

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
// Route to get all bloggers
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    try {
        res.json(await BloggerModel.find().populate('Account'));
    } catch (error) {
        console.error("Error while fetching blogger list:", error);
        res.json({ success: false, error: "Internal Server Error" });
    }
});


router.get('/add', verifyToken, checkAdmin, async (req, res) => {
    try{
        res.status(200).json({ success: true, message: "Render add blogger form"});
    }catch(error){
        console.error("Error while adding blogger list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', verifyToken, checkAdmin, upload.single('image'), async (req, res) => {
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
        const availableUser = await AccountModel.findOne({email: email});
        if(availableUser){
            res.status(500).json({ success: false, error: "User existed"});
        } else {
            const account = await AccountModel.create(
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
                account: account
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
router.get('/edit/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        // Fetch admin details by ID
        const bloggerId = req.params.id;
        const blogger = await BloggerModel.findById(bloggerId);
        if (!blogger) {
            throw new Error('Blogger not found');
        }

        // Fetch account details by ID
        const accountId = blogger.account;
        const account = await AccountModel.findById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        res.json(blogger, account);

    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.status(404).json({ success: false, error: "Blogger not found" });
    }
});

// Handle form submission for editing an admin
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch admin by ID
        const bloggerId = req.params.id;
        const blogger = await BloggerModel.findById(bloggerId);
        if (!blogger) {
            throw new Error('Blogger not found');
        }
        // Fetch user details by ID
        const accountId = blogger.account;
        const account = await AccountModel.findById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        // Update admin details
        blogger.name = req.body.name;
        blogger.dob = req.body.dob;
        blogger.gender = req.body.gender;
        blogger.address = req.body.address;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            blogger.image = imageData.toString('base64');
        }
        await blogger.save();

        account.email = req.body.email;
        account.password = bcrypt.hashSync(req.body.password, salt);
        await account.save();

        // Send success JSON response
        res.json({ success: true, message: "Blogger updated successfully" });
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
            console.error("Error while updating blogger:", err);
            res.json({ success: false, error: "Internal Server Error" });
        }
    }
});

router.get('/profile', verifyToken, checkBlogger, async (req, res) => {
    try{
        var accountId = req.data._id;
        var AccountData = await AccountModel.findById(accountId);
      if(AccountData){
        var bloggerData = await BloggerModel.find({account: accountId});
      } else {
        res.status(500).json({ success: false, error: "Profile not found" });
      }
      res.status(200).json({ success: true, message: "Render edit blogger form", AccountData, bloggerData });
    }catch(error){
        console.error("Error while fetching Blogger:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/editBlogger/:id', verifyToken, checkBlogger, async (req, res) => {
    const bloggerId = req.params.id;
    const blogger = await BloggerModel.findById(bloggerId);
    if (!blogger) {
        res.status(404).json({ success: false, error: "Blogger not found" });
        return;
    }
    // Fetch user details by ID
    const accountId = blogger.account;
    const account = await AccountModel.findById(accountId);
    if (!account) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    try {
        res.status(200).json({ success: true, message: "Render add blogger form", blogger, account });
    } catch (error) {
        console.error(error);
        res.status(404).send('Blogger not found');
    }
    
});

router.post('/editBlogger/:id', verifyToken, checkBlogger, upload.single('image'), async (req, res) => {
    const bloggerId = req.params.id;
    const blogger = await BloggerModel.findById(bloggerId);
    if (!blogger) {
        res.status(404).json({ success: false, error: "Blogger not found" });
        return;
    }
    // Fetch user details by ID
    const accountId = blogger.account;
    const account = await AccountModel.findById(accountId);
    if (!account) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    try {
        // Update marketingmanager details
        blogger.name = req.body.name;
        blogger.dob = req.body.dob;
        blogger.gender = req.body.gender;
        blogger.address = req.body.address;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            blogger.image = imageData.toString('base64');  
        } 
        await blogger.save();
        
        account.password = bcrypt.hashSync(req.body.password, salt);
        await account.save();

        res.status(200).json({ success: true, message: "Update my Blogger data success" });
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           console.error("Error while updating blogger:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
});

module.exports = router;
