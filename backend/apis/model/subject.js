const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SubjectSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    subject: {
      type: String,
      default: "",
    },
    marks: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);
SubjectSchema.plugin(mongoosePaginate);
SubjectSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Subject", SubjectSchema);
