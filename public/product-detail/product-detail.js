angular.module('productDetail', ['n3-line-chart'])
.controller('ProductDetail',
    ['$scope', '$routeParams', 'ProductService',
  function($scope, $routeParams, ProductService){
    // get product from db
    ProductService.getProduct($routeParams.asin, function(err, response){
      if(err){
        return;
      }else{
        $scope.product = response;
        response.analytics.forEach(function(element, index, array){
          array[index].date = new Date(element.date);
        });
        $scope.graphPrices = response.analytics;
      }
    });

    $scope.graphPrices = [];
    $scope.graphOptions = {
      lineMode: "linear",
      tension: 1,
      axes: {
          x: {type: "date", key: "date", ticks: 5},
          y: {type: "linear", min: 0}
      },
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
        formatter: function (date, y, series) {
          return date.getMonth()+1
              + '/' + date.getDate()
              + '/' + date.getUTCFullYear() + ' : '
              + '$' + y;
        }
      }
    };
  }
]);

