angular.module("isubset")
   .controller("iController" , [
      "$scope",
	  "$rootScope",
	  "$http",
	  "$location",
	  "dataFactory",
	  "logService",
      function($scope , $rootScope , $http , $location , dataFactory , logService){
		//reads the data from the server
		var courseInfo={};
		$http.get("js/angularjs/jsonData/courseBriefs.json")
			 .success(function(data){
			   dataFactory.setProperty("explore" , data);
			})
			.error(function(error){
			   courseInfo.error=error;
			   dataFactory.setProperty("explore" , courseInfo);
			});
			
	    var newCourseSchema={};
	    $http.get("js/angularjs/jsonData/newCourseSchema.json")
			 .success(function(data){
			   dataFactory.setProperty("newCourse" , data);
			  
			})
			.error(function(error){ 
			   logService.log("new course schema loading failed");
			   newCourseSchema.error=error;
			   dataFactory.setProperty("newCourse" , newCourseSchema);
			});
			
			
		/**=========handles incoming events======================**/
		   $scope.$on("saveToServer" , function(event , args){
		       logService.log(angular.toJson(args.data));
		   });
		   
		    //this returns the course data from the server
			$scope.$on("getCourse" , function(event , args){
				var course={};
				$http.get("js/angularjs/jsonData/course.json")
					 .success(function(data){
					   dataFactory.setProperty("course" , data);
					   $rootScope.$broadcast("displayCourse" , {purpose:args.purpose});
					})
					.error(function(error){
					   course.error=error;
					   dataFactory.setProperty("course" , course);
					   $rootScope.$broadcast("displayCourse" , {purpose:args.purpose});
					});	
			});
		
		   //validated user event is recieved and main app is displayed
		   $scope.$on("validUser" , function(event , args){
		      var userData={};
			  $http.get("js/angularjs/jsonData/userProfile.json")
				  .success(function(data){
					  dataFactory.setProperty("profile" , data); 
					  $scope.login=true;
			          $scope.activeUser=args.user;
					  $scope.userRef=dataFactory.getUserRef();
				  })
			.error(function(error){
			   userData.error=error;
			   dataFactory.setProperty("profile" , userData);
			});
		   });
		   
		   //this handles new user signing up for leclog
		   $scope.$on("newUser" , function(event , args){
		       logService.log(angular.toJson(args.user) +" event recieved");
			   $rootScope.$broadcast("emailSent" , {code:"secret"});
		   });
		   
		   //This checks to see if the url has been navigated to sign up page
		   $scope.$on("$locationChangeSuccess" , function(event , args){
		      if($location.path()=="/sign-in" || $location.path()=="/sign-up"){
			      $scope.login=false;
			  }
			  else if(($location.path()=="/explore" || $location.path()=="/editor" || $location.path()=="/profile" || $location.path()=="/course") && angular.isDefined($scope.activeUser)){
			     $scope.login=true;
			  }
			  else{
			     $location.path("/sign-up");
			  }
		   });
		/**======================================================**/
		//This logs the user out
		$scope.logOut = function(){
		   $scope.login=false;
		   $scope.activeUser=undefined;
		}
		 //search the telectual for information
		 $scope.searchText="hello";
		 $scope.searchHappyUser = function(data){
		    console.log("you searched " +data);
		    $scope.bindText = data;//use bind text to query the server later
		 };
		 
		 //toggle collapsible search bar
		 $scope.showSearch=false; //$scope.login is used as a sentinel to switch between login page and main app
		 $scope.toggleSearch = function(){
			 $scope.showSearch==true ?  $scope.showSearch=false : $scope.showSearch=true;
		 };
 
		 //this loads either the app or the index page
		 
		 $scope.getAppScreen = function(){
		    return angular.isDefined($scope.activeUser) && $scope.login? "js/angularjs/views/app.html" : "js/angularjs/views/login.html" ;
		 }
   }]);