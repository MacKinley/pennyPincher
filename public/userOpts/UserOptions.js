angular.module('userOptions', [])
.controller('UserOptions',
    ['$scope', '$routeParams',
  function($scope, $routeParams){
    /* TODO do we need the route param?
     * if they are logged in the server should know who user is */
    $scope.user = {
      email           : '',
      displayName     : '',
      oldPassword     : '',
      newPassword     : '',
      confirmPassword : ''
    };

    // temp test data
    $scope.products = [
      {
      "title" : "SanDisk Cruzer CZ36 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP", "asin" : "B007JR532M", "price" : 17.61, "image" : "http://ecx.images-amazon.com/images/I/61JZGK6L--L._SL1500_.jpg" },
      { "title" : "SanDisk Cruzer CZ36 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP", "asin" : "B007JR532M", "price" : 17.61, "image" : "http://ecx.images-amazon.com/images/I/61JZGK6L--L._SL1500_.jpg" },
      { "title" : "SanDisk Cruzer CZ36 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP", "asin" : "B007JR532M", "price" : 17.61, "image" : "http://ecx.images-amazon.com/images/I/61JZGK6L--L._SL1500_.jpg" },
      { "title" : "SanDisk Cruzer CZ36 32GB USB 2.0 Flash Drive, Frustration-Free Packaging- SDCZ36-032G-AFFP", "asin" : "B007JR532M", "price" : 17.61, "image" : "http://ecx.images-amazon.com/images/I/61JZGK6L--L._SL1500_.jpg" }];

    // get all user data on page load
    // email, displayName, subscriptions
    // set user.email and user.displayName

    $scope.unsubscribe = function(asin){

    };

    $scope.updateSettings = function(){

    };

    $scope.updatePassword = function(){

    };
  }
]);

