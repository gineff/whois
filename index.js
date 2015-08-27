var servers = require('./lib/whois.servers.json');
var net = require('net');
var WhoIs = function(){};

WhoIs.prototype.stream = function(){
    var stream = net.createConnection(this.options.port, this.options.hostname);
    stream.addListener('connect', function() {
        stream.write(domain + '\r\n');
    });

    stream.addListener('data', function(data) {
        callback(null, data);
    });

    stream.addListener('error', function(err) {
        callback(err, null);
    });

    stream.addListener('error', function(data) {
        callback(data);
    });

    stream.addListener('end', function() {
        stream.end();
    });

    return this;
};


WhoIs.prototype.request = function(options,cb){

    function getTld(domain){
        var match = domain.match(/^[\w-]+\.((?:[\w-]+\.?)+)$/i) ||
            domain.match(/^xn\-\-[\w-]+\.(xn\-\-(?:[\w-]+\.?1?))+$/i);
        return match && match[1] || null;
    }

    var cbIsFunction = (function(){return Object.prototype.toString.call(cb) == "[object Function]"})();

    function callback(err,res){
        if(cbIsFunction) cb(err,res)
    }

    var hostname = (options) && options.hostname || options;
    var port = (options) && options.port || 43;

    var whoIsServer = servers[getTld(hostname)] ;

    if(whoIsServer){
        var stream =  net.createConnection(port, whoIsServer[0]);

        stream.addListener('connect', function() {
            stream.write(hostname + '\r\n');
        });

        stream.addListener('data', function(data) {
            callback(null, data.toString());
        });

        stream.addListener('error', function(err) {
            callback(err, null);
        });
        stream.addListener('end', function() {
            stream.end();
        });
    }else{
        callback("No whois server for this tld in list!", null);
    }
};

module.exports = new WhoIs();