const router = require("express").Router();
const bycrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleWare = require("../middleware/authMiddleWare");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

router.post("/register", async (req, res) => {
  //Register new user

  try {
    const userExits = await User.findOne({ email: req.body.email });
    console.log("req register body...", userExits);
    if (userExits) {
      return res.send({
        success: false,
        message: "User already exits",
      });
    }
    //hash to password to creat user

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    console.log(hashedPassword);
    // creat user

    const user = new User(req.body);
    await user.save();

    console.log(user);
    return res.send({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login user

router.post("/login", async (req, res) => {
  try {
    //check if user exists

    const user = await User.findOne({ email: req.body.email });
    // console.log(user, "from login user b");
    // console.log(req.body)
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    // console.log(req.body.password ,' before compare')

    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `user is not registered as a ${req.body.userType}`,
      });
    }
    // compare login user password
    const validPassword = await bycrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password try again",
      });
    }

    // generating token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret);
    console.log(token);
    return res.send({
      success: true,
      message: " User has logged in successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});
router.get("/get-current-user", authMiddleWare, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    //remove password form user
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-donors", authMiddleWare, async (req, res) => {
  try {
    //$$$$$$$$$$ one method to get the donor data$$$$$$$$$$$$$$$$$$$$$$44444
    //        const uniqueDonorIds = await Inventory.aggregate([
    // {

    //     $match: {
    //         organization: new mongoose.Types.ObjectId(req.body.userId) ,
    //         inventoryType: 'in',
    //     },
    //     $group : {
    //         _id: "$donor",

    //     },
    // }

    //        ])
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorIds = await Inventory.distinct("donor", {
      organization,
    });

    const donor = User.find({
      _id: { $in: uniqueDonorIds },
    });

    return res.send({
      success: true,
      message: "Donor fetched successfully",
      data: uniqueDonorIds,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-hospitals", authMiddleWare, async (req, res) => {
  try {
    //$$$$$$$$$$ one method to get the donor data$$$$$$$$$$$$$$$$$$$$$$44444
    //        const uniqueDonorIds = await Inventory.aggregate([
    // {

    //     $match: {
    //         organization: new mongoose.Types.ObjectId(req.body.userId) ,
    //         inventoryType: 'out',
    //     },
    //     $group : {
    //         _id: "$hospital",

    //     },
    // }

    //        ])
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalsIds = await Inventory.distinct("hospital", {
      organization,
    });

    const hospital = User.find({
      _id: { $in: uniqueHospitalsIds },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: uniqueHospitalsIds,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get(
  "/get-all-organizations-of-a-donor",
  authMiddleWare,
  async (req, res) => {
    try {
      const Donor = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        Donor,
      });

      const organization = User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Organization fetched successfully",
        data: uniqueOrganizationIds,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

//get all unique organizations for a hospital

router.get(
  "/get-all-organizations-of-a-hospital",
  authMiddleWare,
  async (req, res) => {
    try {
      //get all unique organizations ids form inventoru
      const Hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        Hospital,
      });

      const organization = User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Organization fetched successfully",
        data: uniqueOrganizationIds,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
