angular.module('authentication', [])
.controller('HeaderOptions', ['$scope', 'PopupService', 'UserStorage', 'LoginSignupService',
  function($scope, PopupService, UserStorage, LoginSignupService) {
    $scope.user = UserStorage;

    // check if user is logged in
    LoginSignupService.updateStatus();

    $scope.open = function(type){
      PopupService.open(type);
    };

    $scope.logout = function(){
      LoginSignupService.logout();
    };
  }
])
.controller('LoginPopupInstance', ['$scope', '$modalInstance', 'loginType', 'LoginSignupService',
  function($scope, $modalInstance, loginType, LoginSignupService){
    $scope.type = loginType;

    $scope.user = {
      email: '',
      password: ''
    };

    $scope.setType = function (type){
      $scope.type = type;
    };

    // login or sign up depending on type
    $scope.loginSignUp = function (type){
      if(type == 'Sign Up'){
        LoginSignupService.signup($scope.user);
      }
      else if(type == 'Login'){
        LoginSignupService.login($scope.user);
      }
      $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function (){
      $modalInstance.dismiss('cancel');
    };
  }
]);

