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
.controller('SearchBar',['$scope', '$location', 'ProductService',
  function($scope, $location, ProductService){

    $scope.searchInput;
    $scope.search = function(){
      if($scope.searchInput.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g)){
        console.log('is url');
        // scrape it!
        ProductService.scrapeUrl($scope.searchInput, function(err, asin){
          if(!err){
            $location.path('/product/' + asin);
          }else{
            console.log(err);
          }
        });
      }else{
        $location.path('/search/' + $scope.searchInput);
      }
    };
  }
]);

