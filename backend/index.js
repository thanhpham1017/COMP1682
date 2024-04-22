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

const postRouter = require('./routes/post');
const pinRoute = require("./routes/pin");
const adminRouter = require('./routes/admin');
const guestRoute = require("./routes/guest");
const authRouter = require("./routes/auth");
const bloggerRoute = require("./routes/blogger");
const roleRouter = require("./routes/role");
const categoryRouter = require("./routes/category");
const app = express();

app.use(express.json({ limit: '200mb' }));

// Sử dụng body-parser với giới hạn kích thước tệp
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://thanhpqgch210568:1@cluster0.gac1iv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const secret = "yourSecretKeyHere"; // Define your JWT secret key
app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if(err) throw err;
    res.json(info);
  });
  res.json(req.cookies);
});


app.use(pinRoute);
app.use(postRouter);
app.use(guestRoute);
app.use(adminRouter);
app.use(bloggerRoute);
app.use(authRouter);
app.use(roleRouter);
app.use(categoryRouter);

app.listen(4000);