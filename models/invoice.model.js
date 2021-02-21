const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema({ name: String }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });

const invoiceSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    totalPaid: {
        type: Number,
        required: true
    },
    datePaid: {
        type: Date,
        required: true
    },
}, {
    timestamps: true,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;