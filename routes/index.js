var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt-nodejs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next){
  res.render('signup', {title:'signup'});
});

router.post('/submitUser', function(req, res, next){
  const accountInfo = {
    email:req.body.email,
    password:bcrypt.hashSync(req.body.password, null, null)
  };
  const db = req.con;
  db.query("INSERT INTO customer SET ?", accountInfo, function(err, rows){
    if(err){
      console.log(err);
      res.redirect('/signup');
    }else{
      res.end("successful registration");
    }
  });

});

router.get('/signin', function(req, res, next){
  res.render('signin', {title:"signin"});
});

router.post('/authenticateUsers', function(req, res){
  const db = req.con;
  db.query("SELECT * FROM customer WHERE email = ?", req.body.email, function(err, rows){
    if(err){
      console.log(err);
      res.redirect('/signin');
    }else{
      if(rows.length!==0&&bcrypt.compareSync(req.body.password, rows[0].password)){
        res.end("authentication succeed");
      }else{
        res.end("Wrong email or password");
      }
    }
  });
});

module.exports = router;
