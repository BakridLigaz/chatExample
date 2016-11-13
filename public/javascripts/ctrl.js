var Ctrl = angular.module('Ctrl',[]);
Ctrl.controller('MainCtrl', function($scope,$http){
    var socket = io();
    socket.on('change',function(){
       $scope.refreshUsers();
    });
    socket.on('get msg',function(data){
        console.log(data);
    });
    $scope.refreshUsers = function(){
      $http.get('/users').then(
        function(result){
            $scope.userList = result.data;
        },
          function(){

          }
      );
    };
    $scope.register = function(user){
        $http.post('users/reg',user).then(
            function(result){
                if(result.data=="yes"){
                    $scope.login(user);
                }
            },
            function(){

            }
        )
    };
    $scope.login = function(user){
      $http.post('users/login',user).then(
          function(result){
              socket.emit('auth',{user:user});
              console.log("user - "+result.data.username+" login");
              $scope.currentUser = result.data;
              $scope.refreshUsers();
          },
          function(){

          }
      );
    };
    $scope.logout = function(){
      $http.get('users/logout').then(
          function(){
              $scope.currentUser = {};
              $scope.refreshUsers();
          }

      );
    };
    $scope.send = function(userID,message){
        socket.emit('message',{id:userID});
      $http.post('users/send',{idFrom:$scope.currentUser,idTo:userID,message:message}).then(
          function(){
            console.log("message send");
          },
          function(){

          }
      )
    };
    $scope.refreshUsers();
});