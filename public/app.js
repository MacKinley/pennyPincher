angular.module('app', ['ngRoute', 'ui.bootstrap',
    'homepage', 'loginPopup', 'productDetail'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/product/:asin', {
        templateUrl: './product-detail/product-detail-partial.html',
        controller: 'ProductDetail'
      }).
      otherwise({
        templateUrl: './homepage/homepage-partial'
      });
      $locationProvider.html5Mode(true);
}])
.constant('API_ENDPOINT', 'http://localhost:3000/')
.service('ProductService', ['$http', 'API_ENDPOINT',
  function($http, apiEndpoint){
    this.getProduct = function(asin, callback){
      $http.get(apiEndpoint + 'product:' + asin)
      .success(function(data, status, headers, config){
        callback(data);
      }).error(function(data, status, headers, config){
        callback(data);
      });
    };
}]);

