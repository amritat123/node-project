const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const StudentSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: "",
    },
    profile_pic: {
      type: String,
      default: "",
    },
    date_of_birth: {
      type: String,
      default: "",
    },
    about_me: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 1, // 1=active , 2=deactivated
    },
  },
  { timestamps: true }
);
StudentSchema.plugin(mongoosePaginate);
StudentSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Students", StudentSchema);
