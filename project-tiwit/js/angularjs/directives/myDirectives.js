angular.module("customDirectives" , [])
   .directive("subNav" , function(){
      return{
	     restrict: "E",
		 templateUrl: "js/angularjs/directives/directivetemplates/subnav.html"
	  }
   })
   .directive("emptyCategoryMessage" , function(){
      return{
	     restrict: "E",
		 templateUrl: "js/angularjs/directives/directivetemplates/emptyCategory.html"
	  }
   })
   .directive("quizOption" , function(){
      return {
	     link: function(scope , element , attrs){
			scope.qIndex = attrs["index"]*1;
		 },
		 scope:true,
	     restrict: "E",
		 templateUrl: "js/angularjs/directives/directivetemplates/quizOption.html"
	  }
   })
    .directive("materials" , function(){
      return{
	     link: function(scope , element , attrs){
			scope.tempCategory = attrs["materials"];
		 },
	     restrict: "EA",
		 scope:true,
		 templateUrl: "js/angularjs/directives/directivetemplates/materialsTemp.html"
	  }
   })
   .directive("describeMaterial" , function(){
      return{
	     link: function(scope , elem  , attrs){
		    scope.divWidth = attrs["width"];
		 },
		 restrict: "E",
		 scope:false,
		 templateUrl: "js/angularjs/directives/directivetemplates/describeMaterial.html" 
	  }
   })
   .directive("encryptor" , function(){
	   return{
	     restrict: "E",
	     scope:true,
	     controller:"cryptController",
	     templateUrl: "js/angularjs/directives/directivetemplates/cryptor.html" 
	   }
     
   });