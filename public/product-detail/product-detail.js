angular.module('productDetail', ['n3-line-chart'])
.controller('ProductDetail',
    ['$scope', '$routeParams', 'ProductService', 'PriceSharer',
  function($scope, $routeParams, ProductService, PriceSharer) {
    ProductService.getProduct($routeParams.asin,
    function(response){
      $scope.product = response;
    });
  }
])
.service('PriceSharer', function(){
  this.prices = [
      {
        x: new Date(1422072611079),
        price: 0.00
      },
      {
        x: new Date(1422159011079),
        price: 8.47
      },
      {
        x: new Date(1422245411079),
        price: 13.98
      },
      {
        x: new Date(1422331811079),
        price: 14.60
      },
      {
        x: new Date(1422431811079),
        price: 15.23
      }
  ];
})
.controller('Graph', ['$scope', 'PriceSharer',
  function($scope, PriceSharer){
    $scope.data = PriceSharer.prices;
    $scope.options = {
      lineMode: "linear",
      tension: 1,
      axes: {x: {type: "date", key: "x", ticks: 5}, y: {type: "linear"}},
      drawLegend: false,
      series: [
        {
          y: "price",
          color: "#3A74C5",
          axis: "y",
          type: "line",
          thickness: "3px",
          drawDots: false
        }
      ],
      tooltip: {
        mode: "scrubber",
        formatter: function (x, y, series) {
          return x.getMonth()+1
              + '/' + x.getDate()
              + '/' + x.getUTCFullYear() + ' : '
              + '$' + y;
        }
      }
    };
  }
]);

