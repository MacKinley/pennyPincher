angular.module('productSearch', [])
.controller('ProductSearch',
    ['$scope', '$routeParams', 'ProductService', 'PopupService',
  function($scope, $routeParams, ProductService, PopupService){
    // get products from db on page load
    ProductService.searchByTitle($routeParams.title, function(err, response){
      if(err) {
        return;
      }else{
        $scope.products = response;
      }
    });

    $scope.subscribe = function(asin){
      // check if user is logged in
      // if not activate popup
      PopupService.open('Sign Up');
      // UserService.addSubscription(asin, user.email);
      // prompt user of any errors
      // prompt user so they know they're subscribed and change button to
      // unsubscribe
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

