angular.module('app', ['ngRoute', 'ui.bootstrap',
    'homepage', 'authentication', 'productDetail', 'productSearch', 'userSettings'])
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
    when('/user', {
      templateUrl: './userSettings/userSettings-partial.html',
      controller: 'UserSettings'
    }).
    otherwise({
      templateUrl: './homepage/homepage-partial.html'
    });
    $locationProvider.html5Mode(true);
  }
])
.constant('API_ENDPOINT', 'http://localhost:8000/api/')
.factory('UserStorage', [function(){
  var userInfo = {
    isLoggedIn : false,
    info : {}
  };
  return userInfo;
}])
.service('LoginSignupService', ['$http', 'API_ENDPOINT', 'UserStorage',
  function($http, apiEndpoint, UserStorage){
    this.signup = function(user){
      $http.post(apiEndpoint+'users/signup', user).
        success(function(data, status, headers, config){
          UserStorage.isLoggedIn = true;
          UserStorage.info = data;
        }).
        error(function(data, status, headers, config){ 
          console.log(data);
        });
    };

    this.login = function(user){
      $http.post(apiEndpoint+'users/login', user).
        success(function(data, status, headers, config){
          UserStorage.isLoggedIn = true;
          UserStorage.info = data;
          console.log(data);
          console.log(UserStorage);
        }).
        error(function(data, status, headers, config){
          console.log('err'+data);
        });
    };

    this.logout = function(){
      $http.get(apiEndpoint+'users/logout')
        .success(function(data, status, headers, config){
          UserStorage.isLoggedIn = false;
          UserStorage.info = {
            local:{
              products: []
            }
          };
        })
    };

    this.updateStatus = function(){
      $http.get(apiEndpoint+'users/status')
      .success(function(data, status, headers, config){
        UserStorage.isLoggedIn = data.loggedIn;
        UserStorage.info = data.user;
      });
    };
  }
])
.service('UserService', ['$http', 'API_ENDPOINT', 'UserStorage',
  function($http, apiEndpoint, user){
    this.addSubscription = function(asin, callback){
      $http.post(apiEndpoint + 'users/addSubscription', {'asin': asin})
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };

    this.removeSubscription = function(asin, callback){
      $http.post(apiEndpoint + 'users/removeSubscription', {'asin': asin})
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };

    this.updateEmail = function(newEmail, callback){
      $http.post(apiEndpoint + 'users/updateEmail', {'newEmail': newEmail})
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };

    this.updatePassword = function(currentPassword, newPassword, callback){
      $http.post(apiEndpoint + 'users/updatePassword', {
        'currentPassword' : currentPassword,
        'newPassword'     : newPassword
      })
      .success(function(data){
        callback(data.err, data.user);
      }).error(function(data){
        callback(data, null);
      });
    };
  }
])
.service('ProductService', ['$http', 'API_ENDPOINT',
  function($http, apiEndpoint){
    this.getProduct = function(asin, callback){
      $http.get(apiEndpoint + 'product/' + asin)
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };

    this.searchByTitle = function(title, callback){
      $http.get(apiEndpoint + 'searchFor/' + title)
      .success(function(data){
        callback(null, data);
      }).error(function(data){
        callback(data, null);
      });
    };
  }
])
.service('PopupService', ['$modal',
  function($modal){
    this.open = function(type){
      var modalInstance = $modal.open({
        templateUrl: 'loginPopup/loginPopup-partial.html',
        controller: 'LoginPopupInstance',
        resolve: {
          loginType: function(){
            return type;
          }
        }
      });
    };
  }
]);

