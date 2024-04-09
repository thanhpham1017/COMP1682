const router = require("express").Router();
const multer = require('multer');
const Pin = require("../models/Pin");

const storage = multer.diskStorage({
    destination: 'uploads/pins/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
  
  const upload = multer({ storage: storage });
  
  //create a pin with multiple images
  router.post("/pinCreate", upload.array('images'), async (req, res) => {
    const { title, desc, rating, price, long, lat } = req.body;
    const imagePaths = [];
  
    if (req.files) {
      for (const image of req.files) {
        imagePaths.push(image.path);
      }
    }
  
    const newPin = new Pin({
      title,
      desc,
      rating,
      price,
      long,
      lat,
      images: imagePaths, // Array of image paths
    });
  
    try {
      const savedPin = await newPin.save();
      res.status(200).json(savedPin);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

//get all pins
router.get("/pins", async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;