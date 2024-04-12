const router = require("express").Router();
const Category = require("../models/Category");
const Pin = require("../models/Pin");

//create a pin
router.post("/pinCreate", async (req, res) => {
    const newPin = new Pin(req.body);
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

router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/category/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const pinscategory = await Pin.findById(categoryId);
        res.status(200).json(pinscategory);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;