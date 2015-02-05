angular.module("isubset")
   .constant("courseUrl" , "http://localhost:8080/course")
   .constant("signUpUrl" , "http://localhost:8080/sign-up")
   .constant("signInUrl" , "http://localhost:8080/sign-in")
   .constant("logOutUrl" , "http://localhost:8080/log-out")
   .constant("profileUrl" , "http://localhost:8080/profile")
   .constant("createAccountUrl" , "http://localhost:8080/create-account")
   .factory("dataFactory" , [
      "logService",
      function(logService){
		  var activeUserData = {};
		  var messageCount = 0;
		  return {
			 setProperty: function(property , data){
				if(property=="explore"){
				   activeUserData.explore=data;
				}
				else if(property=="profile"){
					activeUserData.profile=data;
				}
				else if(property=="course"){
					activeUserData.course=data;
				}else if(property=="newCourse"){
				   activeUserData.newCourse=data;
				}
				messageCount++;
			 },
			 getData: function(property){
				if(property=="profile"){
				   return activeUserData[property].userData;
				}
				return (activeUserData[property]);
			 },
			 getUserRef: function(){
				var extract = activeUserData["profile"];
				return {
				   userName:extract.userData.userProfile.userName,
				   userImg:extract.userData.userProfile.img
				};
			 },
			 isDefined: function(property){
				return angular.isDefined(activeUserData[property]);
			 }
		  };
   }
   ])
   .factory("logService", function () {
		var messageCount = 0;
		return {
			log: function (msg) {
			   console.log("(LOG + " + messageCount++ + ") " + msg);
			}
		};
	});