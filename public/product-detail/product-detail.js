angular.module('productDetail', ['n3-line-chart'])
.controller("ProductDetail", ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {
      // get product id with $routeParams
      // then use $http to make api request(s) with the acquired id
    }])
.controller("Graph", function ($scope) {
  $scope.data = [
    {
      x: new Date(1422072611079),
      val_0: 0
    },
    {
      x: new Date(1422159011079),
      val_0: 8.47
    },
    {
      x: new Date(1422245411079),
      val_0: 13.981
    },
    {
      x: new Date(1422331811079),
      val_0: 14.608
    },
    {
      x: new Date(1422418211079),
      val_0: 10.132
    },
    {
      x: new Date(1422504611079),
      val_0: 2.117
    },
    {
      x: new Date(1422591011079),
      val_0: -6.638
    },
    {
      x: new Date(1422677411079),
      val_0: -13.074
    },
    {
      x: new Date(1422763811079),
      val_0: -14.942
    },
    {
      x: new Date(1422850211079),
      val_0: -11.591
    },
    {
      x: new Date(1422936611079),
      val_0: -4.191
    },
    {
      x: new Date(1423023011079),
      val_0: 4.673
    },
    {
      x: new Date(1423109411079),
      val_0: 11.905
    },
    {
      x: new Date(1423195811079),
      val_0: 14.978
    },
    {
      x: new Date(1423282211079),
      val_0: 12.819
    },
    {
      x: new Date(1423368611079),
      val_0: 6.182
    },
    {
      x: new Date(1423455011079),
      val_0: -2.615
    },
    {
      x: new Date(1423541411079),
      val_0: -10.498
    },
    {
      x: new Date(1423627811079),
      val_0: -14.714
    },
    {
      x: new Date(1423714211079),
      val_0: -13.79
    },
    {
      x: new Date(1423800611079),
      val_0: -8.049
    },
    {
      x: new Date(1423887011079),
      val_0: 0.504
    },
    {
      x: new Date(1423973411079),
      val_0: 8.881
    },
    {
      x: new Date(1424059811079),
      val_0: 14.155
    },
    {
      x: new Date(1424146211079),
      val_0: 14.485
    },
    {
      x: new Date(1424232611079),
      val_0: 9.754
    },
    {
      x: new Date(1424319011079),
      val_0: 1.616
    },
    {
      x: new Date(1424405411079),
      val_0: -7.086
    },
    {
      x: new Date(1424491811079),
      val_0: -13.314
    },
    {
      x: new Date(1424578211079),
      val_0: -14.89
    }
  ];
  $scope.options = {
    lineMode: "linear",
    tension: 1,
    axes: {x: {type: "date", key: "x", ticks: 7}, y: {type: "linear"}},
    drawLegend: false,
    series: [
      {
        y: "val_0",
        color: "#3A74C5",
        axis: "y",
        type: "line",
        thickness: "3px",
        drawDots: false
      }
    ],
    tooltip: {mode: "scrubber"}
  };
});

