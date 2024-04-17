const router = require("express").Router();
const Category = require("../models/Category");
const Pin = require("../models/Pin");
const Package = require("../models/Package");
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
        const pinscategory = await Pin.find({category: categoryId});
        res.status(200).json(pinscategory);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/packages", async (req, res) => {
    try {
        const packages = await Package.findById();
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/package/:id", async (req, res) => {
    try {
        const packageId = req.params.id;
        const pinId = req.params.pin;
        const pin = await Pin.findById(pinId);
        const package = await Package.findById(packageId);
        if (packageId == '') {
            pin.date = pin.date + package.date;
        } 

    } catch (err) {}
});

module.exports = router;