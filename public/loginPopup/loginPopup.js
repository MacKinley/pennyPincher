angular.module('loginPopup', [])
.controller('LoginPopup', ['$scope', '$modal',
  function($scope, $modal) {
    $scope.open = function(type){
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
])
.controller('LoginPopupInstance', ['$scope', '$modalInstance', 'loginType', 'LoginSignupService',
  function($scope, $modalInstance, loginType, LoginSignupService){
    $scope.type = loginType;
    $scope.isLoggingIn = ($scope.type === 'Login');

    $scope.user = {
      email: '',
      password: ''
    };

    $scope.setType = function (type) {
      $scope.type = type;
    }

    $scope.loginSignUp = function (type){
      // login or sign up depending on type
      if(type == 'Sign Up'){
        LoginSignupService.signup($scope.user);
      }
      $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



  }
]);

