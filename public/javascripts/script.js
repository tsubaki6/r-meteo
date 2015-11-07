var app = angular.module('flapperNews', []);

app
//.state('forecast', {
//   url: '/forecast',
//   templateUrl: '/',
//   controller: 'MainCtrl'
// })
.controller('MainCtrl', [
'$scope','$http',
function($scope,$http){
  $scope.x = 'Hello world!';
  $scope.dane="a";
  var wunderground = [];
  var interia = [];
  var i,j,days, temperature, wind, qpf;
  $http.get('http://api.wunderground.com/api/6cdc9ccbd68485fe/forecast10day/q/Poland/Krakow.json')
  .success(function(data){
        $scope.dane = data;
        console.log(Object.keys($scope.dane));
        var danesz = data["forecast"]["simpleforecast"]["forecastday"];
        //console.log(data);
        for(i=0;i<danesz.length;i++){
          var forecast = danesz[i];
          days = daysCount(forecast["date"]["day"], forecast["date"]["month"]);
          //console.log(days);
          qpf = forecast["qpf_allday"]["mm"];
          var min, max;
          min = forecast["low"]["celsius"];
          max = forecast["high"]["celsius"];
          temperature = (parseInt(min)+parseInt(max))/2;
          wind = forecast["avewind"]["kph"];//3600;
          wunderground[i] = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"wunderground"}
        }
      $http.post('/',wunderground)
        .success(function(){
         })
  })
  .error(function(){
    console.log('BLAD');
  })

  var daysCount = function(forecastDay, month){
    var data = new Date();
    var day = data.getDate()
    var count;
    //console.log(data.getDate());
    if(day<forecastDay){
      count = forecastDay-day;
    }
    else{
      switch(month){
      case 1,3,5,7,8,10,12: {
        count=31-day+forecastDay;
        break;
      }
      case 4,6,9,11: {
        count=30-day+forecastDay;
        break;
       }
      case 2: {
        count=28-day+forecastDay;
        break;
      }
      }
    }
    //console.log(count);
    return count;
  }
     daysCount(2,2);

    $http.get('http://pogoda.interia.pl/prognoza-dlugoterminowa-krakow,cId,4970')
    .success(function(data){
          $scope.dane2 = data;
          var parser = new DOMParser().parseFromString(data,"text/html");
          var forecast = parser.getElementsByClassName("weather-forecast-longterm-list")[0];
          var min, max;
         for(i=0;i<=7;i++){
            var data = forecast.getElementsByClassName("date")[i].innerHTML.split('.',2);
            days = daysCount(parseInt(data[0]),parseInt(data[1]));
            max = forecast.getElementsByClassName("weather-forecast-longterm-list-entry-forecast-temp")[i].innerHTML;
            min = forecast.getElementsByClassName("weather-forecast-longterm-list-entry-forecast-lowtemp")[i].innerHTML;
            temperature = (parseInt(min)+parseInt(max))/2;
            wind = parseInt(forecast.getElementsByClassName("weather-forecast-longterm-list-entry-wind-value")[i].innerHTML);
            qpf = parseFloat(forecast.getElementsByClassName("weather-forecast-longterm-list-entry-precipitation-value")[i].innerHTML.replace(",","."));
            interia[i] = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"interia"}
         }
          console.log(interia);
         $http.post('/', interia)
            .success(function(){
         })

    })
    .error(function(){
      console.log('BLAD');
    })
  $http.get('http://api.yr.no/weatherapi/locationforecast/1.9/?lat=50.04;lon=19.57')
  .success(function(data){
        $scope.dane3 = data;
        var parser = new DOMParser().parseFromString(data,"application/xml");

  })
  var meteo;
  $http.get('http://meteo.ftj.agh.edu.pl/meteo/meteo.xml')
      .success(function(data){
        $scope.meteo = data;
         var parser = new DOMParser().parseFromString(data,"application/xml");
         var forecast = parser.getElementsByTagName("dane_aktualne")[0];
         days = 0;
         temperature = forecast.getElementsByTagName("ta")[0].innerHTML;
         temperature = temperature.split(" ")[0];
         wind = forecast.getElementsByTagName("sm")[0].innerHTML;
         wind = parseFloat(wind.split(" ")[0])*3.6;
         qpf = forecast.getElementsByTagName("rc")[0].innerHTML;
         qpf = qpf.split(" ")[0]
         meteo = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"meteo"};
         console.log(meteo)
         $http.post('/',meteo)
             .success(function(){
         })
      })
      .error(function(){
        console.log('BLAD');
      })

//   $http.get('/forecast',{"a":1})
//      .success(function(){
//        console.log('OKOKOKO');
//      })


}]);