angular.module('app', ['ngRoute', 'ui.bootstrap',
    'homepage', 'loginPopup', 'productDetail'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/product/:asin', {
        templateUrl: './product-detail/product-detail-partial.html',
        controller: 'ProductDetail'
      }).
      otherwise({
        templateUrl: './homepage/homepage-partial.html'
      });
  }
]);

