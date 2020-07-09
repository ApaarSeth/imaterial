var onSuccess = function (location) {
  alert("Lookup successful:\n\n" + JSON.stringify(location, undefined, 4));
};

var onError = function (error) {
  alert("Error:\n\n" + JSON.stringify(error, undefined, 4));
};

geoip2.city(onSuccess, onError);
