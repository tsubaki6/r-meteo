//(function (window) {
//
//    'use strict';
var app = angular.module('flapperNews', ['ui.router']);

app
.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('forecast', {
       url: '/forecast',
       templateUrl: '/forecast.html',
       controller: 'MainCtrl'
     })
     .state('index',{
		 url:'/index',
		 templateUrl:'/index.html',
		 controller:'MainCtrl'
     })
     //$urlRouterProvider.otherwise('/index');
     })
.controller('MainCtrl', [
'$scope','$http',
function($scope,$http){
  $scope.x = 'Hello world!';
  $scope.dane="a";
  var d = new Date();
  var today = d.getDate() + "-"+(d.getMonth()+1)+"-"+d.getFullYear();
  //console.log(today)
  var wunderground = [];
  var interia = [];
  var i,j,days, temperature, wind, qpf;
  $http.get('http://api.wunderground.com/api/6cdc9ccbd68485fe/forecast10day/q/Poland/Krakow.json')
  .success(function(data){
        $scope.dane = data;
        //console.log(Object.keys($scope.dane));
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
          wunderground[i] = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"wunderground", "date":today}
        }
//      $http.post('/',wunderground)
//        .success(function(){
//         })
  })
  .error(function(){
    console.log('BLAD');
  })

  var daysCount = function(forecastDay, month){
    var data = new Date();
    var day = data.getDate()
    var count;
    //console.log(data.getDate());
     if (day==forecastDay){
         count=0;
     }
     else if(day<forecastDay){
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
            interia[i] = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"interia","date":today}
         }
   //       console.log(interia);
//         $http.post('/', interia)
//            .success(function(){
//         })

    })
    .error(function(){
      console.log('BLAD');
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
         meteo = {"days":days, "temperature":temperature, "qpf":qpf, "wind":wind,"portal":"meteo","date":today};
 //        console.log(meteo)
//         $http.post('/',meteo)
//             .success(function(){
//         })
      })
      .error(function(){
        console.log('BLAD');
      })
var avg = function(arr){
     var sum=0;
     for (var i=0;i<arr.length;i++){
         sum+=parseFloat(arr[i]);
     }
     return (sum/arr.length).toFixed(1);
 }

 var yr = [];
$http.get('http://api.yr.no/weatherapi/locationforecast/1.9/?lat=50.04;lon=19.57')
.success(function(data){
     $scope.dane3 = data;
       var i, data, day, max, min, to, from;
       var days = [];
       var temps = [];
       var winds = [];
       var qpfs = [];
     var parser = new DOMParser().parseFromString(data,"application/xml");
     var forecast = parser.getElementsByTagName("time");
           for (i=0; i<forecast.length;i++) {
               var data = forecast[i].getAttribute("from").toString().substring(5, 10).split('-', 2);
               day = daysCount(parseInt(data[1]), parseInt(data[0]));
               //console.log(day);
               if(day>27){continue;}
               if (day > days[days.length - 1] || i == 0) {
                   days[day] = day;
                   temps[day] = [];
                   winds[day] = [];
                   qpfs[day]= [];
               }
               if (forecast[i].getAttribute("from") == forecast[i].getAttribute("to")) {
                   max = forecast[i].getElementsByTagName("temperature")[0].getAttribute('value');
                   min = forecast[i].getElementsByTagName("dewpointTemperature")[0].getAttribute('value');
                   temps[day].push(((parseFloat(min) + parseFloat(max)) / 2));
                   winds[day].push((parseFloat(forecast[i].getElementsByTagName("windSpeed")[0].getAttribute('mps'))*3.6).toFixed(2));
                   //console.log("wind"+winds[day][winds[day].length - 1]+"max:" + max + "min:" + min + "temp:" + temps[day][temps[day].length - 1] + "d:" + day);
               }
               else {

                   if (forecast[i].getAttribute("to").substring(5, 10) != forecast[i].getAttribute("from").substring(5, 10)){
                       to = parseInt(forecast[i].getAttribute("to").substring(11, 13))+24;
                   }
                   else {to = parseInt(forecast[i].getAttribute("to").substring(11, 13));}
                   from = parseInt(forecast[i].getAttribute("from").substring(11, 13));
                   //console.log("d"+day+"to"+to+"from"+from+"diff"+(to-from));
                   if((to-from)==6){
                       qpfs[day].push(parseFloat(forecast[i].getElementsByTagName("precipitation")[0].getAttribute('value')));

                   }
                   //console.log("qfs"+qpfs[day][qpfs[day].length - 1]);
               }
           }
       for(i=0;i<days.length;i++){
                    if(temps[i]==null || winds[i]==null || qpfs[i]==null){
                        temperature = 0;
                        wind = 0;
                        qpf = 0;
                    }
                    else {
                        temperature = parseFloat(avg(temps[i]));
                        wind = parseFloat(avg(winds[i]));
                        qpf = parseFloat(avg(qpfs[i]));
                    }

                    yr[i] = {"days":days[i], "temperature":temperature, "qpf":qpf, "wind":wind, "portal":"yr","date":today};
                    //console.log(yr[i]);
                }
    //   console.log('y');
   //    console.log(yr);
//        $http.post('/',yr)
//          .success(function(){
//        })
   })
   .error(function(){
       console.log('BLAD');
   })

$scope.printW = function(){
	if($scope.iloscDniW!=undefined && $scope.typW!=undefined){
        $http.get('/forecast')
        .success(function(data){
            var dane = data;
            $scope.chartWunderground = [];
            var i;
            for(i=0;i<dane.length;i++){
            var data = new Date();
            var data2 = new Date();
            data2.setDate(data.getDate()-7)
                var value;
                 if(dane[i]["portal"]=="meteo" && dane[i]["date"]==((data2.getDate())+"-"+(data2.getMonth()+1)+"-"+data2.getFullYear())){
                    value = dane[i][$scope.typW];
                 }
            data.setDate(data.getDate()-dane[i]["days"]-7);

            var pastDate =  data.getDate()+"-"+(data.getMonth()+1)+"-"+data.getFullYear();
                if(dane[i]["portal"]=="wunderground" && dane[i]["days"]<=$scope.iloscDniW && dane[i]["date"]== pastDate && dane[i]["days"]>0 ){
                    $scope.chartWunderground.push({"days":dane[i]["days"], "parametr":dane[i][$scope.typW]})
                }
            }
            chart($scope.chartWunderground,"Wunderground",value);
        })
        .error(function(){
            console.log("BLAD")
        })
    }
}
$scope.printY = function(){
	if($scope.iloscDniY!=undefined && $scope.typY!=undefined){

        $http.get('/forecast')
        .success(function(data){
            var dane = data;
            $scope.chartYrNo = [];
            var i;
            //console.log(dane);
            for(i=0;i<dane.length;i++){
            var data = new Date();
             var value;
            var data2 = new Date();
            data2.setDate(data.getDate()-7)
                var value;
                 if(dane[i]["portal"]=="meteo" && dane[i]["date"]==((data2.getDate())+"-"+(data2.getMonth()+1)+"-"+data2.getFullYear())){
                    value = dane[i][$scope.typW];
                 }
            data.setDate(data.getDate()-dane[i]["days"]-7);
            var pastDate =  data.getDate()+"-"+(data.getMonth()+1)+"-"+data.getFullYear();
                if(dane[i]["portal"]=="yr" && dane[i]["days"]<=$scope.iloscDniY && dane[i]["date"]== pastDate && dane[i]["days"]>0 ){
                    $scope.chartYrNo.push({"days":dane[i]["days"], "parametr":dane[i][$scope.typY]})
                }
            }
            chart($scope.chartYrNo,"yr",value);
        })
        .error(function(){
            console.log("BLAD")
        })
    }
}
$scope.printI = function(){
	if($scope.iloscDniI!=undefined && $scope.typI!=undefined){
        $http.get('/forecast')
        .success(function(data){
            var dane = data;
            $scope.chartInteria = [];
            var i;
            //console.log(dane);
            for(i=0;i<dane.length;i++){
            var data = new Date();
            var value;
            var data2 = new Date();
            data2.setDate(data.getDate()-7)
                var value;
                 if(dane[i]["portal"]=="meteo" && dane[i]["date"]==((data2.getDate())+"-"+(data2.getMonth()+1)+"-"+data2.getFullYear())){
                    value = dane[i][$scope.typW];
                 }
            data.setDate(data.getDate()-dane[i]["days"]-7);
            var pastDate =  data.getDate()+"-"+(data.getMonth()+1)+"-"+data.getFullYear();
                if(dane[i]["portal"]=="interia" && dane[i]["days"]<=$scope.iloscDniI && dane[i]["date"]== pastDate && dane[i]["days"]>0 ){
                    $scope.chartInteria.push({"days":dane[i]["days"], "parametr":dane[i][$scope.typI]})
                }
            }
            chart($scope.chartInteria,"Interia",value);
        })
        .error(function(){
            console.log("BLAD")
        })
    }
}
var pastDate = function(count){
	var data = new Date();
   data.setDate(data.getDate()-count);
   var pastDate =  data.getDate()+"-"+(data.getMonth()+1)+"-"+data.getFullYear();
 }
var d = pastDate(30);
var chart = function(dane, portal,value){
AmCharts.makeChart("chartdiv"+portal,{
                              	"type": "serial",
                              	"categoryField": "days",
                              	"startDuration": 1,
                              	"theme": "default",
                              	"categoryAxis": {
                              		"gridPosition": "start"
                              	},
                              		"chartCursor": {
                                		"enabled": true
                                	},
                                	"chartScrollbar": {
                                		"enabled": true
                                	},
                              	"trendLines": [],
                              	"graphs": [
                              		{
                              			"balloonText": "[[title]] of [[category]]:[[value]]",
                              			"bullet": "round",
                              			"id": "AmGraph-1",
                              			"valueField": "parametr"
                              		}
                              	],
                              	"guides": [],
                              	"valueAxes": [
                              		{
                              			"id": "ValueAxis-1",
                              			        "guides": [{
                                                    "dashLength": 7,
                                                    "inside": true,
                                                    "label": "today",
                                                    "lineAlpha": 1,
                                                    "value": value
                                                }],
                              		}
                              	],
                              	"allLabels": [],
                              	"balloon": {},
                              	"legend": {
                              		"useGraphSettings": true
                              	},
                              	"titles": [
                              		{
                              			"id": "Title-1",
                              			"size": 15,
                              			"text": portal
                              		}
                              	],
                              	"dataProvider": dane,
                              	"export":{
                              	    "enabled": true
                                  }
                              })
                              }
}]);