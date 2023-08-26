const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // if inventory type is "out" then hospital will be set
    // if inventory type is "in" then donor will be set

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: () => {
        return this.inventoryType === "out";
      },
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: () => {
        return this.inventoryType === "in";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("inventories", inventorySchema);

module.exports = Inventory;
