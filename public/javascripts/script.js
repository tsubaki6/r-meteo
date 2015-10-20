var app = angular.module('flapperNews', []);

app.controller('MainCtrl', [
'$scope','$http',
function($scope,$http){
  $scope.x = 'Hello world!';
  $scope.dane="a";
  $http.get('api.yr.no/weatherapi/locationforecast/1.9/?lat=60.10;lon=9.58',
  {transformResponse:function(data) {
                      // convert the data to JSON and provide
                      // it to the success function below
                        //var x2js = new X2JS();
                        var json = x2js.xml_str2json( data );
                        return json;
                        }
                    })
  .success(function(data, callback){
		callback();
		console.log("aaa");
  })
  .error(function(){
	  console.log('blad');
  });
	var callback = function(){
		$scope.dane = data;
		console.log("AA");
	}
}]);