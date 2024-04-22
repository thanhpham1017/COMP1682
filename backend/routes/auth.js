const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = express.Router();
const AccountModel = require('../models/Account');
const { verifyToken } = require('../middlewares/auth');

const salt = bcrypt.genSaltSync(10);
dotenv.config();


router.post('/register', async (req,res) => {
  const {email,password,role} = req.body;
  try{
    const accountDoc = await AccountModel.create({
      email,
      password:bcrypt.hashSync(password,salt),
      role,
    });
    res.json(accountDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});
  
router.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const accountDoc = await AccountModel.findOne({email: email});
  const passOk = bcrypt.compareSync(password, accountDoc.password);
  if(passOk) {
    jwt.sign({email,id:accountDoc._id}, process.env.ACCESS_TOKEN_SECRET, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:accountDoc._id,
        email,
      });
    });
  } else {
    req.status(400).json('wrong credentials')
  }

});

router.get('/profile', verifyToken, (req,res) => {
  res.json(data);
});


router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
})

module.exports = router
