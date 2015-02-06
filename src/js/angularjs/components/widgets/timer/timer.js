angular.module("timerWidget")
   .factory("timerService" , function(){
      var timeObj = {hour:"00" , minute:"00" , second:"00"};
	  return {
	     setTime:function(minutes){
		    
		 },
		 getTime: function(){
		    return timeObj;
		 }
	  }
   })
   .directive("my-timer" , function(timerService){
      return {
	     link: function(scope , elem  ,attrs){
		    scope.start = attrs["start"];
			var duration = attrs["duration"]*1;
			if(duration){
			   var timeObj = timerService.getTime();
			   if(duration>60){
			      timerObj.hour = duration/60; 
				  timerObj.minute = duration%60; 
			   }
			}
		 },
		 restrict:"E",
		 controller:"timerController",
		 templateUrl: "js\angularjs\components\widgets\timer\timer.html"
	  }
   })
   .controller("timerController"  , function($scope , timerService){
       $scope.time = timerService.getTime();
   });