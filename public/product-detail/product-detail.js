angular.module('productDetail', ['n3-line-chart'])
.controller('ProductDetail',
    ['$scope', '$routeParams', 'ProductService', 'PopupService',
  function($scope, $routeParams, ProductService, PopupService){
    $scope.subscribe = function(asin){
      // check if user is logged in
      // if not activate popup
      PopupService.open('Sign Up');
      // UserService.addSubscription(asin, user.email);
      // prompt user of any errors
      // prompt user so they know they're subscribed and change button to
      // unsubscribe
    };

    // get product from db on page load
    ProductService.getProduct($routeParams.asin, function(err, response){
      if(err){
        return;
      }else{
        $scope.product = response.product;
        $scope.product.analytics.forEach(function(element, index, array){
          array[index].date = new Date(element.date);
        });
        $scope.graphPrices = $scope.product.analytics;
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

