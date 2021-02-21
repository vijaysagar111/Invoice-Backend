const router = require("express").Router();
let Invoice = require("../models/invoice.model");
const https = require('https');
const fs = require('fs');
router.route("/").get((req, res) => {
  Invoice.find()
    .then((invoices) => res.json(invoices))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const invoiceNumber = req.body.invoiceNumber;
  const paymentDate = Date.parse(req.body.paymentDate);
  const customerName = req.body.customerName;
  const amount = Number(req.body.amount);
  const totalPaid = Number(req.body.totalPaid);
  const datePaid = Date.parse(req.body.datePaid);

  const newInvoice = new Invoice({
    username,
    invoiceNumber,
    paymentDate,
    customerName,
    amount,
    totalPaid,
    datePaid,
  });

  newInvoice
    .save()
    .then(() => {
      return res.json("Invoice added!");
    })
    .catch((err) => {
      return res.status(400).json("Error: " + err);
    });
});

router.route("/:id").get((req, res) => {
  Invoice.findById(req.params.id)
    .then((invoice) => res.json(invoice))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Invoice.findByIdAndDelete(req.params.id)
    .then(() => res.json("Invoice deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Invoice.findById(req.params.id)
    .them((invoice) => {
      invoice.username = req.body.username;
      invoice.invoiceNumber = req.body.invoiceNumber;
      invoice.paymentDate = req.body.paymentDate;
      invoice.customerName = req.body.customerName;
      invoice.amount = req.body.amount;
      invoice.totalPaid = req.body.totalPaid;
      invoice.datePaid = req.body.datePaid;

      invoice
        .save()
        .then(() => res.json("Invoice updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});


router.post('/generate',(req, res) => {
    
  var invoice = {
      logo: "http://invoiced.com/img/logo-invoice.png",
      from: "GUVI GEEKS PVT LTD\nChennai",
      to: req.body.to,
      currency: "INR",
      number: req.body.number,
      payment_terms: "Auto-Billed - Do Not Pay",
      items: [
          {
              name: req.body.items[0].name,
              quantity: 1,
              unit_cost: req.body.items[0].unit_cost
          }
      ],
      fields: {
          tax: "%"
      },
      tax: 5,
      notes: "Thanks for being an awesome customer!",
      terms: "No need to submit payment. You will be auto-billed for this invoice."
  };
  
  
  
generateInvoice(invoice, `Invoice.pdf`, function() {
  console.log("Saved invoice to invoice.pdf");
}, function(error) {
  console.error(error);
});
res.send("Invoice Generated");
});


function generateInvoice(invoice, filename, success, error) {
  var postData = JSON.stringify(invoice);
  var options = {
      hostname  : "invoice-generator.com",
      port      : 443,
      path      : "/",
      method    : "POST",
      headers   : {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
      }
  };

  var file = fs.createWriteStream(filename);

  var req = https.request(options, function(res) {
      res.on('data', function(chunk) {
          file.write(chunk);
      })
      .on('end', function() {
          file.end();

          if (typeof success === 'function') {
              success();
          }
      });
  });
  req.write(postData);
  req.end();

  if (typeof error === 'function') {
      req.on('error', error);
  }
}



module.exports = router;
