angular.module('userSettings', [])
.controller('UserSettings',
    ['$scope', 'ProductService', 'UserStorage', 'UserService',
  function($scope, ProductService, UserStorage, UserService){
    $scope.user = {
      currentEmail    : UserStorage.info.local.email,
      newEmail        : '',
      currentPassword : '',
      newPassword     : '',
      confirmPassword : ''
    };

    $scope.products = [];

    // get all user data on page load
    UserStorage.info.local.products.forEach(function(asin, index, array){
      ProductService.getProduct(asin, function(err, response){
        if(err){
          return;
        }else{
          $scope.products.push(response.product);
        }
      });
    });

    $scope.isSubscribed = function(asin){
      return (UserStorage.info.local.products.indexOf(asin) != -1);
    };

    $scope.subscribe = function(asin){
      // check if user is logged in
      if(!UserStorage.isLoggedIn){
        // if not activate popup
        PopupService.open('Sign Up');
      }else{
        if(UserStorage.info.local.products.indexOf(asin) != -1){
          console.log('already subscribed');
        }else{
          UserService.addSubscription(asin, function(err, data){
            if(err){
              // prompt user of any errors
              console.log(err);
            }else{
              if(data.err){
                console.log(data.err);
              }else{
                // update UserStorage
                UserStorage.info = data.user;
              }
            }
          });
        }
      }
    };

    $scope.unsubscribe = function(asin){
      // check if user is logged in
      if(!UserStorage.isLoggedIn){
        // if not activate popup
        PopupService.open('Sign Up');
      }else{
        UserService.removeSubscription(asin, function(err, data){
          if(err){
            // prompt user of any errors
            console.log(err);
          }else{
            if(data.err){
              console.log(data.err);
            }else{
              // prompt user so they know they're subscribed and change button to
              UserStorage.info = data.user;
            }
          }
        });
      }
    };

    $scope.updateSettings = function(){
      // validate the email before making request
      UserService.updateEmail($scope.user.newEmail, function(err, data){
        if(err){
          console.log(err);
          $scope.user.newEmail = $scope.user.currentEmail;
        }else{
          if(data.err === 'notLoggedIn'){
            UserStorage.isLoggedIn = false;
            UserStorage.info = {};
          }else if(data.err){
            console.log(data.err);
            $scope.user.newEmail = data.user.local.email;
          }else{
            $scope.user.currentEmail = data.user.local.email;
            $scope.user.newEmail = '';
          }
        }
      });
    };

    $scope.updatePassword = function(){
      // validate first new password field
      // confirm passwords match
      if($scope.user.newPassword === $scope.user.confirmPassword){
        UserService.updatePassword(
            $scope.user.currentPassword, $scope.user.newPassword,
        function(err, data){
          if(!err){
            console.log(err);
          }else{
            $scope.user.currentPassword = '';
            $scope.user.newPassword = '';
            $scope.user.confirmPassword = '';
          }
        });
      }else{
        console.log('passwords do not match');
      }
    };
  }
]);

