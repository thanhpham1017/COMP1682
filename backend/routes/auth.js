const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const router = express.Router();
const Account = require('../models/Account');

const salt = bcrypt.genSaltSync(10);
dotenv.config();


router.post('/register', async (req,res) => {
    const {email,password} = req.body;
    try{
      const accountDoc = await Account.create({
        email,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(accountDoc);
    } catch(e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
  
router.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const accountDoc = await Account.findOne({email});
  const passOk = bcrypt.compareSync(password, accountDoc.password);
  if(passOk) {
    const accessToken = jwt.sign(
        {id:accountDoc._id},
        process.env.ACCESS_TOKEN_SECRET,
    )
    res.cookie('token', token). json(accessToken);
  } else {
    req.status(400).json('wrong credentials')
  }

});


router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
})

module.exports = router
