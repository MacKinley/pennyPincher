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
])
.constant('API_ENDPOINT', 'http://localhost:8000/api/')
.service('LoginSignupService', ['$http', 'API_ENDPOINT',
  function($http, apiEndpoint){
    this.signup = function(user){
      $http.post(apiEndpoint+'users/signup', user).
        success(function(data, status, headers, config){
          console.log(data);
        }).
        error(function(data, status, headers, config){
          console.log('err');
        });
    }
  }
]);
