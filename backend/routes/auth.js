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




router.get('/profile', verifyToken, (req,res) => {
  try{
    var account = req.accountId;
    res.status(200).json({ success: true, message: "Render edit blogger form", account });
}catch(error){
    console.error("Error while fetching Blogger:", error);
    res.status(500).send("Internal Server Error");
}
});


router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
})

module.exports = router
