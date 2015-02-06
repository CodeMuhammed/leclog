angular.module("isubset")
   .controller("indexController" ,[
      "$scope",
	  "$rootScope",
	  "$location",
	  "logService",
      function($scope , $rootScope , $location , logService){
		  $scope.input="hello there welcome to isubset";
		  $scope.signIn=true;
		  $scope.validateNew = false;
		  $scope.option="Sign Up";
		  $scope.invOpt="Sign in"; 
		  
		  //This function takes care of toggling between sign in and sign up mode
		  $scope.toggleSignIn = function(){ 
			  if($scope.signIn){
				 $scope.option="Sign In";
				 $scope.invOpt="Sign up";
				 $location.path("sign-up");
			  }else{
				 $scope.option="Sign Up";
				 $scope.invOpt="Sign in";
				 $location.path("sign-in");
			  }
			  $scope.signIn=!$scope.signIn;
			  $scope.validateNew = false;
		  };
		  //This toggle search box on small screens
		  $scope.searchbox=false;
		  
		  //takes care of form validation	 
		  //this method takes the information entered by the user ie username and password
		  //and do a server side validation before redirecting to main app or login page again
		  $scope.validateSignIn=function(userData){
			 //validation of user happens here by sending a promise to the server
			 if(true){
				$rootScope.$broadcast("validUser" , {user:$scope.activeUser});
				logService.log(angular.toJson($scope.activeUser));
			 }
			 else{
				$scope.submitError=true;
			 }
			 if(angular.isDefined( $scope.showSignInValidation)){ 
				 $scope.showSignInValidation = true;
			 }
		  };
		  
		  //This method takes the information entered and creates a new user profile on the server
		  //and then redirects the user to it
		  $scope.validateSignUp = function(newUser){
			 $scope.invOpt="Validate account";
			 $rootScope.$broadcast("newUser" , {user:newUser});
		  };
		  
		  //this validates the code the sent to the user email against the one sent from the server
		  $scope.validateCode = function(newUser){
			 logService.log(angular.toJson(newUser));
		  };

		  //This determines if the input box is for password or not
		  $scope.inputView = "password";
		  $scope.toggleHiddenPassword = function(view){
			  $scope.inputView = view;
		  }
		  
		  /**===============incoming events =============================*/
			   $scope.$on("emailSent" , function(event , args){
				   $scope.validateNew = true;
				   logService.log("email sent to user and server has returned the coresponding code" + args.code);
			   });
		  /**============================================================*/
	  
   }
   ]);