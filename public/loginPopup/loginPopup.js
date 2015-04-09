angular.module('loginPopup', [])
.controller('LoginPopup', ['$scope', 'PopupService',
  function($scope, PopupService) {
    $scope.open = function(type){
      PopupService.open(type);
    };
  }
])
.controller('LoginPopupInstance', ['$scope', '$modalInstance', 'loginType',
  function($scope, $modalInstance, loginType) {
    $scope.type = loginType;
    $scope.isLoggingIn = ($scope.type === 'Login');

    $scope.user = {
      email: '',
      password: ''
    };

    $scope.setType = function (type) {
      $scope.type = type;
    }

    $scope.loginSignUp = function (type) {
      // login or sign up depending on type
      $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);

