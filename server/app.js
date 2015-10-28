var express = require('express');
var app = express.Router();
var Invoice = require('./models').Invoice;
var config = require('./config');
var stripe = require("stripe")(config.STRIPE_SECRET_KEY);

app.get('/api/invoice/:id', function(req, res) {
  var id = req.params.id;

  Invoice.find({ invoiceId: id }, function(err, invoices) {
    if (err) return res.status(500).send('Error finding invoice');

    var invoice = invoices[0]
    if (invoice) return res.send(invoice);

    Invoice.createRandom(id, function(err, invoice) {
      return res.send(invoice);
    });

  });
});

app.post('/api/invoice/:id/payment', function(req, res) {
	var id = req.params.id;
//Look up invoice
	Invoice.find({ invoiceId: id }, function(err, invoices) {
		 if (err) return res.status(500).send('Error finding invoice');

	var invoice = invoices[0]
	if (invoice) return res.status(404).send("Could not find invoice");

//Make a payment with stripe

	var stripeToken = request.body.stripeToken;
	var description = Invoice# + invoice.invoiceId;
	var amount = invoice.total;

	var charge = stripe.charges.create({
  	amount: amount, // amount in cents, again
  	currency: "usd",
  	source: stripeToken,
  	description: description
	}, function(err, charge) {
  	if (err && err.type === 'StripeCardError') {
    // The card has been declined
  }
 	res.send(charge); 
});



    
});

});


module.exports = app;
