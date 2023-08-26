const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    //common for all
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organization", "hospital", "admin"],
    },

    // is required if usertype is donor or admin
    name: {
      type: String,
      required: () => {
        if (this.userType == "admin" || this.userType == "donor") {
          return true;
        }
        return false;
      },
    },

    // is required if usertype is hospital name
    hospitalName: {
      type: String,
      required: () => {
        if (this.userType == "hospital") {
          return true;
        }
        return false;
      },
    },

    // is required if usertype is organization name
    organizationName: {
      type: String,
      required: () => {
        if (this.userType == "organization") {
          return true;
        }
        return false;
      },
    },
    //common for all
    email: {
      type: String,
      required: true,
      unique: true,
    },
    //common for all
    password: {
      type: String,
      required: true,
    },
    // hospital and org
    phone: {
      type: String,
      required: true,
    },
    // hospital and org
    website: {
      type: String,
      required: () => {
        if (this.userType == "organization" || this.userType == "hospital") {
          return true;
        }
        return false;
      },
    },
    address: {
      type: String,
      required: () => {
        if (this.userType == "organization" || this.userType == "hospital") {
          return true;
        }
        return false;
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
