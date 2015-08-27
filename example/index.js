var whois = require('../index');

var options = {url: "google.com"};

whois.request(options,function(error, response){
   if(error)console.log(error);
   else console.log(response)
});