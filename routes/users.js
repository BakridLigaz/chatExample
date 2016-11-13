 var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var User = require('../models').User;
/* GET users listing. */

router.get('/', function(req, res, next) {
  User.findAndCountAll().then(
      function(result){
        res.json(result.rows);
      },
      function(err){
        next(err);
      }
  )
});

router.post('/login',passport.authenticate('local'),function(req,res,next){
  User.findOne({where:{username:req.body.username}}).then(
      function(user){
        user.update({status:true}).then(
          function(){
            res.json(user.dataValues);
          }
        );
      },
      function(err){
        next(err);
      }
  );

});

router.post('/reg',function(req,res,next){
  var user = req.body;
  user.status = false;
  User.create(user).then(
    function(user){
      console.log("create new user - "+user.username);
      res.end('yes');
    },
      function(err){
        console.log(err);
        next(err);
      }
  );
});

router.get('/logout',function(req,res,next){

});

 router.post("/send",function(req,res,next){
    var from = req.body.idFrom;
     var to = req.body.idTo;
     var message = req.body.message;

 });

 module.exports = function(io){
     //start listen with socket.io
     router.io = io;

     router.io.on('connection', function(socket){
         console.log('a user connected');
         socket.on('message',function(data){
            console.log(data.id);
             socket.broadcast.emit('get msg',{message:data.message});
         });
         socket.on('auth',function(user){
             socket.user = user;
            console.log(socket.user);
             socket.broadcast.emit('change',{});
         });
         socket.on('disconnect', function(){
             if(!socket.user){
                 return;
             }
             console.log(socket.user);
             var name = socket.user.user.username;
             User.findOne({where:{username:name}}).then(
                 function(user){
                   user.update({status:false}).then(
                       function(){
                           socket.broadcast.emit('change',{});
                       }
                   );
                 }
             );
             console.log('user disconnected');
         });
     });
     return router;

};
