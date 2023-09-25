const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const loginVerificationSchema = mongoose.Schema(
  {
    code: {
      type: Number,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
loginVerificationSchema.plugin(mongoosePaginate);
loginVerificationSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("loginVerification", loginVerificationSchema);
