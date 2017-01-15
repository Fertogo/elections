var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var rsa = require('node-rsa');

/* GET home page. */
router.get('/', function(req, res, next) {


  var key = new rsa();
  key.generateKeyPair();


  // var e = 65537
  // var n = key.getModulus();
  // console.log(n);
  // console.log("A");
  // var r = blindingFactor(n);
  // var m = 10;

  // var m = "This is a message";
  var em = key.encrypt(m);

  console.log(key.decrypt(em).toString());

  var signed = key.sign(m);
  console.log(signed.toString('hex'));

  console.log(key.verify(m, signed));

  // console.log(key.exportKey())
  // console.log(key.exportKey('public'))


  res.render('index', { title: 'Express' });
});

// var blindingFactor = function(n) {
//     console.log("finding blinding factor");
//     r = Math.random()*(n-1)

//     while(gcd(r,n) != 1){
//         console.log(r);
//         r = r+1;
//     }

//     return r
// }

// var gcd = function(a, b) {
//     if ( ! b) {
//         return a;
//     }

//     return gcd(b, a % b);
// };

module.exports = router;
