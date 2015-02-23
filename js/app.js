angular.module('app', ['priceGraph']);

angular.module('priceGraph', ['chart.js']).controller("Graph", function ($scope) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.data = [
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});

