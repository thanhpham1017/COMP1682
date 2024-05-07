const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const postRouter = require('./routes/post');
const pinRouter = require("./routes/pin");
const adminRouter = require('./routes/admin');
const guestRouter = require("./routes/guest");
const authRouter = require("./routes/auth");
const bloggerRouter = require("./routes/blogger");
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

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
//const io = new Server(server);

mongoose.connect('mongodb+srv://thanhpqgch210568:1@cluster0.gac1iv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(pinRouter);
app.use(postRouter);
app.use(guestRouter);
app.use(adminRouter);
app.use(bloggerRouter);
app.use(authRouter);
app.use(roleRouter);
app.use(categoryRouter);


// Deployment routes

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send("API is running success");
    });
}

// Deployment routes

const port = process.env.PORT || 4000

io.on('connection', (socket) => {
    socket.on('comment', (msg) => {
      io.emit("new-comment", msg);
    })
    //('new-pin', savedPin)
});

server.listen(port, () => {
  console.log(` Server running on port ${port}`);
});