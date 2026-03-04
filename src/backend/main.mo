import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  module Preferences {
    public type Record = {
      city : Text;
      latitude : Float;
      longitude : Float;
      inCelsius : Bool;
    };

    public func compare(p1 : Record, p2 : Record) : Order.Order {
      Text.compare(p1.city, p2.city);
    };
  };

  let preferencesMap = Map.empty<Principal, Preferences.Record>();

  public shared ({ caller }) func savePreferences(city : Text, latitude : Float, longitude : Float, inCelsius : Bool) : async () {
    let newPreferences : Preferences.Record = {
      city;
      latitude;
      longitude;
      inCelsius;
    };
    preferencesMap.add(caller, newPreferences);
  };

  public query ({ caller }) func getPreferences() : async Preferences.Record {
    switch (preferencesMap.get(caller)) {
      case (null) { Runtime.trap("No preferences found for caller " # caller.toText()) };
      case (?preferences) { preferences };
    };
  };

  public query func getAllPreferences() : async [Preferences.Record] {
    preferencesMap.values().toArray().sort();
  };
};
