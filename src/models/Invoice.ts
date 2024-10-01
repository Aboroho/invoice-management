// models/Invoice.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least 2 characters."],
  },
  //   roll: {
  //     type: String,
  //     required: false,
  //     minlength: [1, "Roll number must not be empty"],
  //   },
  studentID: {
    type: String,
    required: true,
    minlength: [1, "Roll number must not be empty"],
  },
  studentClass: {
    type: String,
    required: true,
    minlength: [3, "Class name must be at least 3 characters"],
  },
  mobile: {
    type: String,
    required: true,
    length: [11, "Phone number must be 11 digits."],
  },
  tutionFees: {
    type: Number,
    required: true,
    min: [0, "Tution Fee must be greater than or equal to 0"],
  },
  sessionFees: {
    type: Number,
    required: true,
    min: [0, "Session Fee must be greater than or equal to 0"],
  },
  admissionFees: {
    type: Number,
    required: true,
    min: [0, "Admission Fee must be greater than or equal to 0"],
  },
  fine: {
    type: Number,
    min: [0, "Fine cannot be negative"],
    default: 0,
  },
  forMonth: {
    type: String,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    required: true,
  },
  forYear: {
    type: Number,
    max: new Date().getFullYear(),
    required: true,
  },
});

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
