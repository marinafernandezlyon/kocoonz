var express     = require('express');
var mongoose    = require('mongoose');
var session     = require("express-session");
var fileUpload  = require('express-fileupload');
var bodyParser  = require('body-parser');
var request     = require('request');

mongoose.connect('mongodb://localhost/kocoonz' , function(err) {

});



var homeSchema = mongoose.Schema({
  title:String,
  desc: String,
  location: String,
  price: Number,
  lat: Number,
  lon: Number
});

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    home: [homeSchema]
});
var UserModel = mongoose.model('User', userSchema);

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
 session({ 
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: false,
 })
);
app.use(fileUpload());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.render("home");
})
app.get('/find', function(req, res) {
  
  console.log(req.query.location);
  
  var home = [];
  UserModel.find(function(err, users) {
    for(var i=0; i<users.length; i++) {
      for(var y=0; y<users[i].home.length; y++) {
        //console.log(users[i].home[y]);
       
        var locationForm = req.query.location.trim();
        var locationBDD  = users[i].home[y].location; 
        if(locationBDD != undefined && locationBDD.indexOf(locationForm) != -1) {
        //if(locationBDD == locationForm) {
          home.push(users[i].home[y]);
        }

      }
    }
    
    //console.log(home);
    res.render("find", {homeList : home});
  });
  


})


app.get('/check-login', function(req, res) {

  UserModel.find( { email: req.query.email, password: req.query.password} , function (err, user) {
    if(user.length > 0) {
      req.session.islogue = true;
      req.session.email =  user[0].email;
      req.session.password = user[0].password;  
      res.redirect("/");
    } else {
     res.redirect("/login");
    }

  });

})


app.get('/login', function(req, res) {
  res.render("login");
})


app.get('/register', function(req, res) {
  console.log(req.query.email+'//'+req.query.password);

  var user = new UserModel ({
   email: req.query.email, 
   password: req.query.password
  });
  user.save(function (error, user) {
      
      req.session.islogue = true;
      req.session.email =  req.query.email;
      req.session.password = req.query.password;
      
      res.redirect("/");
  });

})


app.get('/register-form', function(req, res) {
  res.render("register");
})

app.get('/hote', function(req, res) {
  
  console.log(req.session.islogue+' / '+req.session.email+' / '+req.session.password);
  
  if(req.session.islogue == true) {
    res.render("hote");
  } else {
    res.redirect("/login");
  }
})

app.post('/register-hote', function(req, res) {
  

  UserModel.find( { email: req.session.email, password: req.session.password} , function (err, user) {
    

    request("http://free.gisgraphy.com/geocoding/geocode?address="+req.body.location+"&country=fr&postal=true&format=JSON&from=1&to=10&indent=false", function(error, response, body) {
      body = JSON.parse(body);
      
      user[0].home.push({  
        title: req.body.title,
        desc: req.body.desc,
        location: req.body.location,
        price: req.body.price,
        lat: body.result[0].lat,
        lon: body.result[0].lng
      });

      user[0].save(function() {
          var total = user[0].home.length;
          
          req.files.picture.mv('./public/img/home/'+user[0].home[total-1].id+'.jpg', function(err) {
          });
          res.redirect("/");
      });
    
    });

   
    
  })
  
  
})

app.listen(80, function () {
  console.log("Server listening on port 80");
});