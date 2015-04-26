angular.module('productDetail', ['n3-line-chart'])
.controller('ProductDetail',
    ['$scope', '$routeParams',
      'UserStorage', 'UserService', 'ProductService', 'PopupService',
  function($scope, $routeParams,
      UserStorage, UserService, ProductService, PopupService){
    $scope.userSubscriptions = UserStorage.info.local.products;

    $scope.isSubscribed = function(asin){
      return (UserStorage.info.local.products.indexOf(asin) != -1);
    };

    $scope.subscribe = function(asin){
      // check if user is logged in
      if(!UserStorage.isLoggedIn){
        // if not activate popup
        PopupService.open('Sign Up');
      }else{
        if(UserStorage.info.local.products.indexOf(asin) != -1){
          console.log('already subscribed');
        }else{
          UserService.addSubscription(asin, function(err, data){
            if(err){
              // prompt user of any errors
              console.log(err);
            }else{
              if(data.err){
                console.log(data.err);
              }else{
                // update UserStorage
                UserStorage.info = data.user;
              }
            }
          });
        }
      }
    };

    $scope.unsubscribe = function(asin){
      // check if user is logged in
      if(!UserStorage.isLoggedIn){
        // if not activate popup
        PopupService.open('Sign Up');
      }else{
        UserService.removeSubscription(asin, function(err, data){
          if(err){
            // prompt user of any errors
            console.log(err);
          }else{
            if(data.err){
              console.log(data.err);
            }else{
              // prompt user so they know they're subscribed and change button to
              UserStorage.info = data.user;
            }
          }
        });
      }
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

