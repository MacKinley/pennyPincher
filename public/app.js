angular.module('app', ['ngRoute', 'ui.bootstrap',
    'homepage', 'loginPopup', 'productDetail', 'productSearch', 'userOptions'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/product/:asin', {
        templateUrl: './product-detail/product-detail-partial.html',
        controller: 'ProductDetail'
      }).
      when('/search/:title', {
        templateUrl: './search/search-partial.html',
        controller: 'ProductSearch'
      }).
      when('/user/:userId', {
        templateUrl: './userOpts/userOpts-partial.html',
        controller: 'UserOptions'
      }).
      otherwise({
        templateUrl: './homepage/homepage-partial.html'
      });
      $locationProvider.html5Mode(true);
  }
])
.constant('API_ENDPOINT', 'http://localhost:8000/api/')
.service('ProductService', ['$http', 'API_ENDPOINT',
  function($http, apiEndpoint){
    this.getProduct = function(asin, callback){
      $http.get(apiEndpoint + 'product:' + asin)
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };

    this.searchByTitle = function(title, callback){
      $http.get(apiEndpoint + 'searchFor:' + title)
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };
  }
])
.service('PopupService', ['$modal',
  function($modal) {
    this.open = function(type){
      var modalInstance = $modal.open({
        templateUrl: 'loginPopup/loginPopup-partial.html',
        controller: 'LoginPopupInstance',
        resolve: {
          loginType: function () {
            return type;
          }
        }
      });
    };
  }
]);

