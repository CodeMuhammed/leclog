angular.module("isubset")
   .value("activeClass" , "subNav-style-active")
   .value("sideMenuActiveClass" , "active")
   .controller("filterButtonController" , [
         "$scope",
  		 "$rootScope",
		 "$location",
		 "dataFactory",
		 "activeClass",
		 "sideMenuActiveClass",
		 "logService",
		 
       function($scope , $rootScope ,$location , dataFactory ,   activeClass , sideMenuActiveClass , logService){
   
      //This function inits the application based on the current location
	  function refresh(){
	    switch($location.path()){
		   case "/explore":$location.path("/explore");return "explore";
		   case "/editor":$location.path("/editor"); return "editor";
		   default: $location.path("/explore");return "explore";
		}
	  }
	  /*===================================sub-nav button control==========================================*/
	 //This variables stores the sub-button array in the navbar for each context and manages the context 
	 //i.e switching buttons when the user interacts with the view NOTE::@the view manages link change for now@
      var buttonObj = {
		 profile  :['teaching' ,'info', 'learning' , 'settings'], 
		 explore  :['recent' , 'all' , 'free' , 'paid'],
		 course   :['button1' , 'button2'],
		 editor   :["create-new" , "edit-existing" , "save-changes"],
		 payment  :["account details" , "subscriptions"]
	  };
	  
	  /*This portion of the code initializes the buttons to false leaving them in an un-highlighted state*/
	  var initButtons=function(){
	     $scope.activeCategory={};
	     for(var i=0; i<$scope.filterButtons.length; i++){
	        $scope.activeCategory[$scope.filterButtons[i]]=false;
	     }
	  };
	  
	  $scope.context=refresh();
	  $scope.filterButtons = buttonObj[$scope.context];
	  initButtons();
	  
	  //this method resets the sub-nav when link changes
	  function reset(){
	      initButtons();
		  $scope.activeCategory[buttonObj[$scope.context][0]]=true;
		  switch($scope.context){
		     case "explore":$location.path("/explore"); break;
			 case "profile":$location.path("/profile"); break;
			 case "editor":$location.path("/editor"); break;
			 
		  };
	  }

	  $scope.activateNav=function(context){
	     $scope.filterButtons = buttonObj[context];
		 $scope.context=context;
		 reset();
	  };
	  reset();
	  /*===================================================================================================*/
	
	  
	 /*this portion takes care of the categories of courses viewable to the user*/
	  $scope.categoryIndex=0;
	  /*$scope.dropDown=function(index){
	     $scope.categoryIndex=index;
		 $scope.activateNav('explore');
	  }*/
	  $scope.getActiveCategory=function(index){
	     return $scope.categoryIndex==index ?  'active': "";
	  };
	  
	 /*This portion takes care of how the toggling of one button affects the others in the same group*/
	  $scope.selectCategory =function(button){
	     if(angular.isString(button)){
		    switch($scope.context){
			   case "profile": 
			   case "editor":
			   case "payment":
			   case "course":
			   case "course": {
			      initButtons();
				} break;
				
				case "explore": {
			       if(button=="all"){
					   initButtons();
					}
					else if(button=="recent"){
					   $scope.activeCategory["all"]=false;
					}
					else if(button=="free"){
					   $scope.activeCategory["paid"]=false;
					}
					else if(button=="paid"){
					   $scope.activeCategory["free"]=false;
					}
				} break;
				
			};
			
			$scope.activeCategory[button]=true;
		 }
		 /**broadcasts a button change event to all involved**///@BroadCasting
		 $rootScope.$broadcast("changeSelection" , {dataSentFrom: "filterButtonController" , buttons:$scope.activeCategory, context:$scope.context});
	  };
	  
	  /**==============handles incoming events========================**/
	  $scope.$on("displayCourse" , function(event , args){ 
	      if(args.purpose=="view"){
		     $scope.activateNav("course");
			 $location.path("/course");
		  }
		  else if(args.purpose="edit"){
		      $scope.activateNav("editor");
			  $location.path("/editor");
		  }
	      
	  });
	  
	  $scope.$on("editMyCourse" , function(event , args){
	     $scope.activateNav("editor");
		 $location.path("/editor");
	  });
	  /**=============================================================**/
	  
	  //returns the css property of the active class of the sub-nav
	  $scope.categoryActiveClass=function(button , index){
	         if($location.path()=="/editor"){
			    return "";
			 }
		     return $scope.activeCategory[button]==true ? activeClass : "";
	  };
	  
	  //This portion toggles side menus
	  var showSideMenu=false;
	  $scope.toggleSideMenu = function(){
		 showSideMenu==true ? showSideMenu=false : showSideMenu = true;
	  };
	  
	  $scope.sideMenuActive = function(){
	     if(showSideMenu){
		     return sideMenuActiveClass;
		 }
		 return ""; 
	  }; 
	 
   }]);