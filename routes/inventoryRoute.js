const router = require('express').Router();
const authMiddleWare = require('../middleware/authMiddleWare');
const User = require("../models/userModel");
const Inventory = require('../models/inventoryModel')
const mongoose = require('mongoose')


 


//add inventory

router.post("/add", authMiddleWare, async(req,res) => {
try {
    //validate email and inventoryType
    const user =await User.findOne({email: req.body.email})
    if(!user) throw new Error("Invalid Email")

    if(req.body.inventoryType==="in"
    && user.userType!=="donor"){
        throw new Error(" This email is not recognised as Donor")
    }

    if(req.body.inventoryType==='out'
    && user.userType!=="hospital"){

        throw new Error("This email is not recognised as Hospital")
    }
    
    if(req.body.inventoryType==="out"){

// varify the availability of requested quanity
const requestedGroup = req.body.bloodGroup ;
const requestedQuantity = req.body.quantity ;
const organization = new mongoose.Types.ObjectId(req.body.userId);

const totalInOfRequestedGroup = await Inventory.aggregate([
{
    $match: {
        organization,
        inventoryType: 'in',
        bloodGroup : requestedGroup,
    }
},
{  
$group : {
        _id: "$bloodGroup",
        total : {$sum: '$quantity'}
    },

},

]);  
// have to know why we useing [0] before .total
const totalIn = totalInOfRequestedGroup[0].total || 0;

const totalOutOfRequestedGroup = await Inventory.aggregate([
    {
        $match: {
            organization,
            inventoryType: 'out',
            bloodGroup : requestedGroup,
        }
    },
    {
        $group : {
            _id: "$bloodGroup",
            total : {$sum: '$quantity'}
        },
    
    },
    
    ]);  //why we use ? with [0]
    const totalOut = totalOutOfRequestedGroup[0]?.total || 0;

const avaiableQuantityOfRequestedGroup = totalIn - totalOut ;

if(avaiableQuantityOfRequestedGroup<requestedQuantity){
    throw new Error (`Only ${avaiableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} is available`);
}
        req.body.hospital = user._id
    }
    else {
        req.body.donor= user._id
    }

    //add inventory
    const inventory = new Inventory(req.body)
    await inventory.save();

    return res.send({
        success : true,
        message : " Inventory added successfully"
    })

} catch (error) {
    return res.send({
        success: false,
        message: error.message,
    }) 
}
} ),

//get inventory
router.get("/get", authMiddleWare, async(req,res) => {

    try {
        const inventory = await Inventory.find({organization: req.body.userId}).sort({createdAt: -1}).populate('donor').populate('hospital') 
        return res.send({
            success : true,
            data : inventory
        })  

    } catch (error) {
        return res.send({
        success: false,
        message: error.message,
    })
    }
})


router.post("/filter", authMiddleWare, async(req,res) => {

    try {
        const inventory = await Inventory.find(req.body.filters).sort({createdAt: -1}).populate('donor').populate('hospital').populate('organization'); 
        return res.send({
            success : true,
            data : inventory
        })  

    } catch (error) {
        return res.send({
        success: false,
        message: error.message,
    })
    }
})

module.exports = router;