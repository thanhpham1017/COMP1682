const express = require('express');
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const {verifyToken} = require('./middlewares/auth');

const AdminModel = require('./models/Admin');
const BloggerModel = require('./models/Blogger');
const UserModel = require('./models/User');
const GuestModel = require('./models/Guest');

const salt = bcrypt.genSaltSync(10);
const secret = 'bnxbcvxcnbvvcxvxcv';


app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } catch(e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
  
app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if(passOk) {
    const accessToken = jwt.sign(
        {username,id:userDoc._id},
        process.env.ACCESS_TOKEN_SECRET,
    )
    res.cookie('token', token). json(accessToken);

    var userId = user._id;
        //Admin
        var AdminData = await AdminModel.findOne({user: userId});
        if(AdminData){
           req.session.admin_id = AdminData._id;
        }
        var BloggerData = await BloggerModel.findOne({user: userId});
        if(BloggerData){
           req.session.blogger_id = BloggerData._id;
        }
        var GuestData = await GuestModel.findOne({user: userId});
        if(GuestData){
           req.session.guest_id = GuestData._id;
        }
        req.session.user_id = user._id;
        req.session.email = user.email;
        req.session.role = user.role;
        // if (user.role == '65e61d9bb8171b6e90f92da3') { //role: admin
        //     res.redirect('/admin');
        // }
        // if (user.role == '65e61d9bb8171b6e90f92da3') { //role: admin
        //     res.redirect('/admin');
        // }
        // if (user.role == '65e61d9bb8171b6e90f92da3') { //role: admin
        //     res.redirect('/admin');
        // }

    // jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
    //   if(err) throw err;
    //   res.cookie('token', token).json({id:userDoc._id,username,});
    // });
  } else {
    req.status(400).json('wrong credentials')
  }

});


app.post('/logout', (req, res) => {
    req.session.destroy();
  res.cookie('token', '').json('ok');
})

module.exports = router
