angular.module('app', ['ngRoute', 'ui.bootstrap',
    'homepage', 'loginPopup', 'productDetail'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/product/:asin', {
        templateUrl: './product-detail/product-detail-partial.html',
        controller: 'ProductDetail'
      }).
	  when('/user/:userId', {
        templateUrl: 'userOpts/userOpts-partial.html',
        controller: 'UserOpts'
      }).
      otherwise({
        templateUrl: './homepage/homepage-partial'
      });
  }]);