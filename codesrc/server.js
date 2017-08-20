var express = require('express');
var app = express();
var router = express.Router();
  
app.set('view engine', 'ejs');
var path = __dirname + '/views/';

app.use('/',router);

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

  
router.get('/',function(req, res){
  res.render('index.ejs');
});

app.listen(8000, function () {
console.log('Example app listening on port 3000!');
});
