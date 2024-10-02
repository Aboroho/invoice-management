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
  fees: [
    {
      feeDetails: {
        type: String,
        required: true,
        length: [3, "Fee details must be at least 3 digits"],
      },
      feeAmount: {
        type: Number,
        required: true,
        min: [0, "Fee can not be negetive"],
      },
    },
  ],
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
