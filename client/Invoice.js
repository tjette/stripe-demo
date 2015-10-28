var React = require('react');
var request = require('superagent');

var LineItem = React.createClass({
  render: function() {
    var lineItemModel = this.props.model;
    var price = (lineItemModel.priceInCents / 100).toFixed(2);

    return (
      <tr>
        <td>{lineItemModel.description}</td>
        <td className="price">{price}</td>
      </tr>
    );
  }
});

module.exports = React.createClass({
handleClick: function(e){
  var invoice = this.props.model;
  var description = 'Invoice# ' + invoice.invoiceId;
  this.stripeCheckout.open({
      name: 'Travis Jette',
      description: description,
      amount: invoice.total
    });
    e.preventDefault();
},

handleStripeToken: function(token){
  console.log('token', token);

  var id = this.props.model.invoiceId;
  request
    .post('/api/invoice/' + id + 
      '/payment')
    .end(function(err, res) {
      if(err) return console.error(err); 
      console.log("response from payment: ", res);
    });
},

render: function() {
  console.debug('render.model:', this.props.model);
  

  this.stripeCheckout = StripeCheckout.configure({
    key: 'pk_test_P5VCIAn9TaffqxE4GCmedQps',
    image: '/img/mcs-logo-128x128.png',
    locale: 'auto',
    token: this.handleStripeToken
      
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    
  });


  //Just for testing in the console. Remove before production
    window.handleStripeToken = this.handleStripeToken;

    var invoice = this.props.model;
    var invoiceId = invoice.invoiceId;
    var lineItemModels = invoice.lineItems;
    var lineItems = lineItemModels.map(function(lineItem) {
      return (
        <LineItem model={lineItem} key={lineItem.orderIndex} />
      )
    });
    var displayTotal = (invoice.total / 100).toFixed(2);

    var user = invoice.user;
    var name = user.name
    var displayName = sentenceCase(name.title + ' ' + name.first + ' ' + name.last);

    var location = user.location;
    var street = sentenceCase(location.street);
    var city = sentenceCase(location.city);
    var state = sentenceCase(location.state);
    var zip = location.zip;
    var phone = user.phone;

    var description = 'Invoice #' + invoiceId

    return (
      <div>
        <h1>Invoice #{invoiceId}</h1>

        <h2>Bill To</h2>
        <p>
          {displayName}<br/>
          {street}<br/>
          {city}, {state} {zip}<br/>
          {phone}
        </p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="price">Price</th>
            </tr>
          </thead>

          <tbody>
            {lineItems}
          </tbody>

          <tfoot>
            <tr>
              <th className="total">Total:</th>
              <td className="price">${displayTotal}</td>
            </tr>
          </tfoot>
        </table>

        <button onClick={this.handleClick}>Pay Now</button>
        

      </div>
    );
  }

});

function sentenceCase(s) {
    return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
