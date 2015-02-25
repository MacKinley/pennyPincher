angular.module('app', ['ngRoute', 'productDetail'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/product/:asin', {
        templateUrl: 'product-detail/product-detail-partial.html',
        controller: 'ProductDetail'
      });
  }]);

