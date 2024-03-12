const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const app = express();
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = 'bnxbcvxcnbvvcxvxcv';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

mongoose.connect('mongodb+srv://thanhpqgch210568:1@cluster0.gac1iv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

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
    jwt.sign({username,id:userDoc._id}, secret, {}, (err, token) => {
      if(err) throw err;
      res.cookie('token', token).json({id:userDoc._id,username,});
    });
  } else {
    req.status(400).json('wrong credentials')
  }
});


app.listen(4000);