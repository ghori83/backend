const router = require('express').Router();
const mongoose = require("mongoose")
const Inventory = require('../models/inventoryModel')
const authMiddleWare = require('../middleware/authMiddleWare');


//get all blood groups totalIn totalOut and avaiable data from Inventory
router.get("/blood-groups-data", authMiddleWare, async(req,res) => {

    try {
const allBloodgroups = ["a+","a-","b+","b-","ab+","ab-","o+","o-"];
const organization = new mongoose.Types.ObjectId(req.body.userId);
const bloodGroupsData = [];

await Promise.all(
    allBloodgroups.map(async(bloodGroup) =>{

        const totalIn = await Inventory.aggregate([
            {
                $match: {
                    organization,
                    inventoryType: 'in',
                    bloodGroup : bloodGroup,
                }
            },
              {
                  $group : {
                    _id: null,
                    total : {$sum: '$quantity'}
                },
            },
        ])

        const totalOut = await Inventory.aggregate([
            {
                $match: {
                    organization,
                    inventoryType: 'out',
                    bloodGroup : bloodGroup,
                }
            },
            {  
                $group : {
                    _id: null,
                    total : {$sum: '$quantity'}
                },
            },
        ]);

        const avaiable = (totalIn[0]?.total||0); - (totalOut[0]?.total||0);

        bloodGroupsData.push({
            bloodGroup,
            totalIn: totalIn[0]?.total||0,
            totalOut: totalOut[0]?.total||0,
            avaiable,
        });

    } )
)
       res.send({
        success: true,
        message: "Blood Groups Data",
        data: bloodGroupsData,
       }) 



    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }






})

module.exports  = router;