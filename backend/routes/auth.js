const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');


const GuestModel = require('../models/Guest');
const AccountModel = require('../models/Account');
const AdminModel = require('../models/Admin');
const BloggerModel = require('../models/Blogger');

const salt = bcrypt.genSaltSync(10);
dotenv.config();


router.post('/register', async (req,res) => {
  const {email,username,password,role} = req.body;
  try{
    const accountDoc = await AccountModel.create({
      email,
      username,
      password:bcrypt.hashSync(password,salt),
      role,
    });
    if (accountDoc.role === 'Admin') {
      const newadmin = await AdminModel.create({
        name: '',
        dob: Date.now(),
        gender: '',
        address: '',
        image: '',
        account: accountDoc._id // Associate the admin with the created account
      });
      if (newadmin) {
        return res.status(201).json({ success: true, message: "Admin created successfully" });
      } else {
          return res.status(500).json({ success: false, message: "Error creating Admin" });
      }
    } else if (accountDoc.role === 'Blogger') {
      const newblogger = await BloggerModel.create({
        name: '',
        dob: Date.now(),
        gender: '',
        address: '',
        image:'',
        account: accountDoc._id // Associate the blogger with the created account
      });
      if (newblogger) {
        return res.status(201).json({ success: true, message: "Blogger created successfully" });
      } else {
          return res.status(500).json({ success: false, message: "Error creating Blogger" });
      }
    } else if (accountDoc.role === 'Guest') {
      const newguest = await GuestModel.create({
        name: '',
        dob: Date.now(),
        gender: '',
        address: '',
        image:'',
        account: accountDoc._id // Associate the guest with the created account
      });
      if (newguest) {
        return res.status(201).json({ success: true, message: "Guest created successfully" });
      } else {
          return res.status(500).json({ success: false, message: "Error creating Guest" });
      }
    }else{
      return res.status(500).json({ success: false, message: "Error" });
    }
    res.json(accountDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const accountDoc = await AccountModel.findOne({ email });
    if (!accountDoc) {
      return res.status(400).json({ error: 'Email not found' });
    }
    const passOk = bcrypt.compareSync(password, accountDoc.password);
    if (passOk) {
      const accessToken = jwt.sign({ id: accountDoc }, process.env.ACCESS_TOKEN_SECRET);
      res.cookie('token', accessToken).json({ accessToken });
    } else {
      res.status(400).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const accountId = req.accountId;
    // Find the user by accountId
    const user = await AccountModel.findById(accountId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Assuming username is stored in the 'username' field of the User model
    const username = user.username;
    res.status(200).json({ success: true, message: 'Render edit blogger form', username });
  } catch (error) {
    console.error('Error while fetching Profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/auth/profile', verifyToken, async (req, res) => {
  try {
    const accountRole = req.accountId.role;  // Lấy vai trò từ token
    const accountId = req.accountId._id;     // Lấy ID tài khoản từ token

    let userData;  // Khởi tạo biến để lưu dữ liệu người dùng

    // Sử dụng phương thức truy vấn phù hợp dựa trên vai trò
    if (accountRole === "blogger") {
      userData = await BloggerModel.findOne({ account: accountId }).populate('account');
    } else if (accountRole === "Guest") {
      userData = await GuestModel.findOne({ account: accountId }).populate('account');
    } else if (accountRole === "Admin") {
      userData = await AdminModel.findOne({ account: accountId }).populate('account');
    } else {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    if (!userData) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    res.status(200).json({ success: true, userData });  // Gửi dữ liệu người dùng trong phản hồi
  } catch (error) {
    console.error("Error while fetching profile:", error);
    res.status(500).send("Internal Server Error");
  }
});


// router.get('/auth/profile', verifyToken, async (req, res) => {
//   var accountRole = req.accountId.role;
//   if (accountRole === "Blogger") {
//       try{
//         var accountId = req.accountId;
//       if(accountId){
//         var bloggerData = await BloggerModel.find({account: accountId._id});
//       } else {
//         res.status(500).json({ success: false, error: "Profile not found" });
//       }
//       res.status(200).json({ success: true, message: "Render edit blogger form", accountId, bloggerData });
//     }catch(error){
//         console.error("Error while fetching Blogger:", error);
//         res.status(500).send("Internal Server Error");
//     }
//   } else if (accountRole === "Guest") {
//       try{
//         var accountId = req.accountId;
//       if(accountId){
//         var GuestData = await GuestModel.findById({account: accountId._id});
//       } else {
//         res.status(500).json({ success: false, error: "Profile not found" });
//       }
//       res.status(200).json({ success: true, message: "Render edit guest form", accountId, GuestData });
//     }catch(error){
//         console.error("Error while fetching Guest:", error);
//         res.status(500).send("Internal Server Error");
//     }
//   } else if (accountRole === "Admin") {
//       try{
//         var accountId = req.accountId;
//       if(accountId){
//         var AdminData = await AdminModel.findById({account: accountId._id});
//       } else {
//         res.status(500).json({ success: false, error: "Profile not found" });
//       }
//       res.status(200).json({ success: true, message: "Render edit admin form", accountId, AdminData });
//     }catch(error){
//         console.error("Error while fetching Admin:", error);
//         res.status(500).send("Internal Server Error");
//     }
//   }
// });

router.post('/auth/edit/:id', verifyToken, async (req, res) => {
  var accountrole = req.accountId.role;
  if (accountrole === "Blogger") {
    const bloggerId = req.params.id;
    const blogger = await BloggerModel.findOne({account: bloggerId});
    if (!blogger) {
        res.status(404).json({ success: false, error: "Blogger not found" });
        return;
    }
    // Fetch user details by ID
    const accountId = req.params.id;
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
        await blogger.save();
        
        account.username = req.body.username;
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
  } else if (accountrole === "Guest") {
    const guestId = req.params.id;
    const guest = await GuestModel.findOne({account: guestId});
    if (!guest) {
        res.status(404).json({ success: false, error: "Guest not found" });
        return;
    }
    // Fetch user details by ID
    const accountId = req.params.id;
    const account = await AccountModel.findById(accountId);
    if (!account) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    try {
        // Update marketingmanager details
        guest.name = req.body.name;
        guest.dob = req.body.dob;
        guest.gender = req.body.gender;
        guest.address = req.body.address;
        await guest.save();
        
        account.username = req.body.username;
        await account.save();

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
  } else if (accountrole === "Admin") {
    const adminId = req.params.id;
    const admin = await AdminModel.findOne({ account: adminId });
    if (!admin) {
        res.status(404).json({ success: false, error: "Admin not found" });
        return;
    }
    // Fetch user details by ID
    const accountId = req.params.id;
    const account = await AccountModel.findById(accountId);
    if (!account) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    try {
        // Update marketingmanager details
        admin.name = req.body.name;
        admin.dob = req.body.dob;
        admin.gender = req.body.gender;
        admin.address = req.body.address;
        await admin.save();
        
        account.username = req.body.username;
        await account.save();

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
  }
});


router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
})

module.exports = router
