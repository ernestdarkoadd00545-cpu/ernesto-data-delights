import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import OutCall "./http-outcalls/outcall";
import Stripe "./stripe/stripe";

actor {
  var nextOrderId = 0;

  type Order = {
    network : Text;
    bundle : Text;
    price : Text;
    phoneNumber : Text;
    timestamp : Int;
  };

  let orders = Map.empty<Int, Order>();

  // Stripe config stored in backend
  var stripeConfig : ?Stripe.StripeConfiguration = ?{
    secretKey = "sk_test_1b030a0a43cdf530d9605d7fe2978fd61d6339e7";
    allowedCountries = ["GH"];
  };

  public query func transformResponse(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func placeOrder(network : Text, bundle : Text, price : Text, phoneNumber : Text) : async () {
    if (phoneNumber.size() != 10) {
      Runtime.trap("Phone number must have exactly 10 digits");
    };

    let order : Order = {
      network;
      bundle;
      price;
      phoneNumber;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().reverse().toArray();
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?config) {
        await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transformResponse);
      };
    };
  };

  public query func isStripeConfigured() : async Bool {
    switch (stripeConfig) {
      case (null) { false };
      case (?_) { true };
    };
  };
};
