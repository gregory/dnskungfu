var http = require('http');
var https = require('https');

DYNDNS = {
  api_key: 'YOURKEY',
  email: 'YOUREMAIL',
  current_ip: null,
  hostname: 'YOURALIAS',

  cloudflare_url: 'https://www.cloudflare.com/api_json.html?tkn=',
  dyn_ip: function(){
     http.get("http://checkip.dyndns.com", function(res){
       res.setEncoding('utf8');
       res.on('data', function (chunk) {
        var ip = chunk.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g).toString();
        if(DYNDNS.current_ip != ip){
          DYNDNS.current_ip = ip;
          console.log('update to new ip: '+ ip);
          DYNDNS.update_cloudflare(ip);
        }
      });
    }).on('error', function(e) {
      setTimeout(DYNDNS.dyn_ip, 5 * 3600000);
    });
  },

  update_cloudflare: function(ip){
  req_path = '/api_json.html?tkn=' + DYNDNS.api_key + '&a=DIUP&ip=' + DYNDNS.ip + '&u=' + DYNDNS.email + '&hosts=' + DYNDNS.hostname;
  https.get({ host: 'www.cloudflare.com', path: req_path }, function(res){}).on('error', function(e) {
    console.log("Got error: " + e.message);
    setTimeout(DYNDNS.update_cloudflare(ip), 5000);
  });
}
};

var it = setInterval(DYNDNS.dyn_ip, 10000);
//clearInterval(it);
