const express = require('express');
const router = express.Router();
const Category = require("../models/Category");
const Pin = require("../models/Pin");
const Package = require("../models/Package");
const { verifyToken } = require("../middlewares/auth");
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

router.get("pin/package/:id", async (req, res) => {
    try {
        const pinId = req.params.id;
        const pin = await Pin.findById(pinId);
        const packages = await Package.find();

        const PackageId = req.body.selectedPackage;
        const selectedPackage = await Package.findById(PackageId);

        const addTime = selectedPackage.time;
        const timeToAddInMilliseconds = addTime * 60 * 60 * 1000;

        pin.time = new Date();
        pin.time = pin.time.getTime() + timeToAddInMilliseconds;

        await pin.save();

        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/popular", async (req, res) => {
    try {
        const pin = await Pin.find();
        if (pin) {
            const now = new Date();
            const pinData = await pin.filter(Pin => Pin.time >= now.getTime());
            if (pinData) {
                res.status(200).json({success: true, pinData});
            } else {
                res.status(404).json({success: false, error: "No popular restaurant"});
                return;
            }
        } else {
            res.status(404).json({success: false, error: "No restaurant"});
                return;
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;