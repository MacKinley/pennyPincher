angular.module('productSearch', [])
.controller('ProductSearch',
    ['$scope', '$routeParams',
      'UserStorage', 'UserService', 'ProductService', 'PopupService',
  function($scope, $routeParams,
      UserStorage, UserService, ProductService, PopupService){
    // get products from db on page load
    ProductService.searchByTitle($routeParams.title, function(err, response){
      if(err) {
        return;
      }else{
        $scope.products = response;
      }
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
  }
])
.controller('SearchBar',['$scope', '$location',
  function($scope, $location){
    $scope.searchInput;
    $scope.search = function(){
      $location.path('/search/' + $scope.searchInput);
    };
  }
]);

