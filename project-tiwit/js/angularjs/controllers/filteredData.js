/*The filteredDataController defined in this module is nested within the filterButtonController which
 *allows for the buttons selection to be done separately from the actual data filtering
 */////////////////////////////////////////////////////

angular.module("isubset")
   .constant("dataIncrementSize" , 4)
   .controller("filteredDataController" , function($scope, $rootScope ,$location , dataIncrementSize , dataFactory , logService){
	  
     //This controller accepts an array of data via an event channel and paginates on them based on request
	 /*How to use this controller
	  *1. broadcast a $setPaginate event with an object that contains an array of data you will like to paginate
	  *2. When ever you want more data from the cache , broadcast a $loadData event with the name of the controller involved
	  *3. listen to the $paginate event broadcast from this controller which contains an object of the paginated data .
	  */
	 var client="";
	 var data=[];
	 var paginated=[];
	 
	 /**====================handles incoming events============================**/
	  $scope.$on("setPaginate" , function(event , args){
	     paginated=[];
	     client=args.client;
		 data=args.data;
	  });
	  $scope.$on("loadData" , function(event , args){
	      if(args.client==client){
			  logService.log("loading more data to "+client);
			  loadMore();
			  $rootScope.$broadcast("paginate" , {client:client , data:paginated});
		  }
	  });
	 /**=======================================================================**/
      
	 //loading more data to the view
	   var loadMore = function(){
	      var count=0;
	      for(var i=paginated.length; i<data.length; i++){
		     paginated.push(data[i]);
			 count++;
			 if(count==dataIncrementSize)break;
		  }
	   };
   })
   
   /*this controller takes care of tasks specific to explore controller like extending views that filteredDataCtrl does
    *not see as generic*/////////////////////////////////////////////////////////////////////////////////independent
   .controller("exploreController" , function($scope ,$rootScope ,$filter , $location , dataFactory , logService){
	  //this shows or hide the explore side menu
	  $scope.menuOpen = false;
	  $scope.toggleExploreMenu = function(){
	     $scope.menuOpen  ? $scope.menuOpen =false : $scope.menuOpen  = true;
	  }
	  
	  
      $scope.data=dataFactory.getData("explore");
	  $scope.me = dataFactory.getData("profile");
	  $scope.buttonNames=['recent' , 'all' , 'free' , 'paid'];
	  $scope.buttons={recent:true , all:false , free:false , paid:false}; 
	  				   
	  /****************************************************************************************
      *filtering based on selected buttons will be done in the controller while the view will *
	  *be updated with it                                                                     *
      *****************************************************************************************/
	   //This portion of the code does filtering on actual data based on the buttons selected
	  //var lastLogin = dataFactory.getData("profile").userProfile.lastLogin.dayCount;
	  var isValid = function(data , button){
	     if(button=="all"){
			return true;
		 }
		 else if(button=="paid"){
			return data.courseAccess=="paid";
		 }
		 else if(button=="free"){
			return data.courseAccess=="free";
		 }
		 else if(button=="recent"){
			return true;
		 }
	  };
	  
	  //uses the filter function to filter on the data
	  var categoryFilterFn = function(data){
	     for(var i=0; i<$scope.buttonNames.length; i++){
		     if($scope.buttons[$scope.buttonNames[i]]){
			    if(!isValid(data , $scope.buttonNames[i])){
				   return false;
				}
			 }
		 }
		 return true;
	  };
	  
	  var filterData = function(){
	     $scope.filteredData = [];
		  if(angular.isDefined($scope.selectedBriefs)){
			for(var i=0; i<$scope.selectedBriefs.length; i++){
			   if(categoryFilterFn($scope.selectedBriefs[i])){
				  $scope.filteredData.push($scope.selectedBriefs[i]); 
			   }
			}
		 }
        sortIfRecent();
	  };
	  
	  //this method sorts the filtered data by most recent
	  //Algorithm :: store the array in tempData look for the smallest and transfer it 
	  //to filteredData.. repeat until temp is empty
	  function sortIfRecent(){
	     if($scope.buttons["recent"]){
			 var tempData = $scope.filteredData;
			 $scope.filteredData=[];
			 var min=0;
			 while(tempData.length>0){
				 for(var i=0; i<tempData.length; i++){
					if(tempData[i].courseId.created <= tempData[min].courseId.created){
					   min=i;
					}
				 }
				 $scope.filteredData.push(tempData[min]);
				 tempData.splice(min , 1);
				 min=0;
			 }  
		 }
	  };

	  //all i have to add is take the data and seperate them into an array
	  //containing the course categories and add a behaviiour on the view such
	  //that when clicked will set the course briefs in focus to the specified
	  //course briefs and the rest procedure will remain the same
	  //
	  $scope.menuItems=["sciences","arts","general" , "medicine","lifestyle","music", "economics","high-school","research","college",
	                    "sciences1","arts1","general1" , "medicine1","lifestyle1","music1", "economics1","high-school1","research1","college1"
	            ];
	  $scope.selected=$scope.menuItems[0];
	  
	  //this activates the data set in a given category
	  //NOTE: when the filter is applied to the view category  , the data set returned will be out of sync 
	  //with the scope's data set so when an index from the view is returned to the scope , it loads data in a
	  //different category index
	  //SOLUTION:to solve this problem whenever a category is to be activated , the data in the scope is filtered
	  //manually using the $filter service which makes the data set sync thus indices of data in view and in scope matches
	  //problem solved :-)
	  $scope.activate=function(index , nope){
	     var temp=$scope.menuItems; //this is to ensure that the original menu is retrieved after the explore data has been activated on the filterd menu items
	     if(angular.isDefined($scope.filterText)){
		    $scope.menuItems=$filter("filter")($scope.menuItems , $scope.filterText);
		 }
	     
	     $scope.activeIndex=index;
		 $scope.selected=$scope.menuItems[index];
		 $scope.selectedBriefs = [];
		 
		 if(angular.isDefined($scope.data.courseBriefs)){
			for(var i=0; i<$scope.data.courseBriefs.length; i++){
			   if($scope.data.courseBriefs[i].category==$scope.selected){
				  $scope.selectedBriefs.push($scope.data.courseBriefs[i]);
			   }
			}
		 }
		 $scope.menuItems=temp;
		 $scope.selectCategory('recent');//from button controller 
         if(nope!="nope"){
		    $scope.toggleExploreMenu();	
         } 			
	  };
	  $scope.activate(0);
	  
	  //This returns the number of data in a given category
	  $scope.getCategoryCount = function(menu){
	     var count=0;
		 
		 if(angular.isDefined($scope.data.courseBriefs)){
			for(var i=0; i<$scope.data.courseBriefs.length; i++){
			   if($scope.data.courseBriefs[i].category==menu){
				  count++;
			   }
			}
		 }
		 
	     return count;
	  }
       	  
	  /**===========handles incoming events==================**/
	    
	  $scope.$on("changeSelection" , function(event , args){
	     if(args.context=="explore"){
		    $scope.buttons=args.buttons;
			filterData();
			$rootScope.$broadcast("setPaginate" , {client:"explore" , data:$scope.filteredData});
			$rootScope.$broadcast("loadData" , {client:"explore"});
		 }
	  });
	  $scope.$on("paginate" , function(event , args){
	     logService.log("data paginated"+args.data);
		 $scope.shown=args.data;
	  });
	  /**====================================================**/
	  //This takes care of loading more data to the view 
	  $scope.loadMore=function(){
	     $rootScope.$broadcast("loadData" , {client:"explore"});
	  };
 
	  //This section controls the side box for posting announcements
	  $scope.isOpen=false;
	  $scope.postAnnouncement=function(){
	     $scope.isOpen=!$scope.isOpen;
		 !$scope.isOpen ? $scope.placeholder.head="Quick announcement to my students" : $scope.placeholder.head="Enter the subject here";
	  };
	  
	  /**Initial run to set up data**/
	  filterData();
	  $rootScope.$broadcast("setPaginate" , {client:"explore" , data:$scope.filteredData});
	  $rootScope.$broadcast("loadData" , {client:"explore"});
	  
	  /*when the eye is clicked the course view is loaded*/
	  $scope.loadCourse=function(index , purpose){
	     $rootScope.$broadcast("getCourse" ,{courseId:index , client:"explore" , purpose:purpose});
	  };
	  
   })
   
    /*this controller takes of course view*/////////////////////////////////////////////////////////////independent
   .controller("courseController" , function($scope , $rootScope ,$location , logService , dataFactory ){ 
       //This section takes care of the switching between editor mode and normal mode for course view
	   $scope.editorMode=false;
	  
	   $scope.data={};
	   //This takes care of data initialization
	   $scope.initCourseData = function(){
	       if(dataFactory.isDefined("course")){
	          $scope.data.courseData = dataFactory.getData("course"); 
			   
		   }else {
			  $scope.data.courseData = angular.copy(dataFactory.getData("newCourse")); 
			  //sets the user variables on the new course
			  $scope.data.courseData.contents.courseBrief.courseId.courseBy=dataFactory.getUserRef();
		   }
		   $scope.mainNav =$scope.data.courseData.mainNav;
		   $scope.data.contents=$scope.data.courseData.contents;
	   }
	   $scope.initCourseData();
		  
	  
	   /*This section sets the index of the side menu that is clicked and sets it as active in the view
	    *since there are two categories of side menu , main and extras , the index of the extras nav will
		*be its index + the size of the main nav so as for it to be a continuation  of it
	    */
	   $scope.activeIndex = 0;
	   $scope.displayCategory=function(index){
	      $scope.activeIndex = index;
		  $rootScope.$broadcast("changeCourseNav" , {index:index});
		  $scope.toggleSideMenu();
	   };
	   /********************************************************************************************/
	   $scope.getScreen=function(){
	      switch($scope.mainNav[$scope.activeIndex]){
		     case "instructions":return '/js/angularjs/components/courseThemes/default/instructions.html';
			 case "videos":return '/js/angularjs/components/courseThemes/default/videos.html';
			 case "materials":return '/js/angularjs/components/courseThemes/default/materials.html';
			 case "class-forum":return '/js/angularjs/components/courseThemes/default/class-forum.html';
			 case "course-info":return '/js/angularjs/components/courseThemes/default/course-info.html';
			 case "quizzies":return '/js/angularjs/components/courseThemes/default/quizzies.html';
		  }
		  return "";
	   }; 
	   
	   /**============================Handles incoming events===============================**/
	   //This portion of the code takes care of transporting data to the different categories that makes up the course
	   //That only displays the data but not modify it
	   $scope.$on("getCategoryData" , function(event , args){
	      logService.log(args.category+' sent'); 
	      var result="";
	      switch(args.category){
		     case "classForum":{
			    result=$scope.data.contents.classForum;  
		     }break;
		  } 
		   var userInfo = dataFactory.getUserRef();
		   $rootScope.$broadcast("dataExtracted" , {
		      data:result ,
			  category:args.category , 
			  user:userInfo.userName,
			  userImg:userInfo.userImg
		   }); 
	   });
	   
	   //when course nav is changed
	   $scope.$on("changeCourseNav" , function(event ,args){
	      $scope.describedMaterial=null;
		  $scope.activeInsVideo = 0;
		  if($scope.mainNav[args.index]=="videos" || $scope.mainNav[args.index]=="instructions"){
		     $scope.setActiveInsVideo(0 , $scope.mainNav[args.index]);
		  }
		  else if($scope.mainNav[args.index]=="materials"){
		     $scope.displayedMaterials="textBooks";
		  }
	   });
	   
	   //this reset the course data with the new or updated data in the factory 
	   $scope.$on("reset" , function(event , args){
				 dataFactory.setProperty("course" , undefined);
				 $scope.initCourseData();
				 logService.log("reset course data event recieved");
	   });
	  /**===================================================================================**/
	  
	  //this section takes care of the behavior of course materials
	  $scope.describedMaterial={};
	  $scope.describe = function(category , index){
	     $scope.describedMaterial={};
		 $scope.materialIndex=index;
	     $scope.describedMaterial = $scope.data.contents.materials[category][index];
	  }
	  
	  //this takes care of collapsing the various materials category and also uncollapsing them
	  $scope.displayMaterials =function(category){
	     $scope.displayedMaterials = category;
		 $scope.describedMaterial=null;
		 $scope.materialIndex;
		 $rootScope.$broadcast("undoEdit" , {});
	  }
	  
	  //this takes care of collapsing and uncollapsing instructions and videos
	  $scope.activeInsVideo = 0;
	  $scope.setActiveInsVideo = function(index  , category){
	     $scope.describedMaterial={};
	     $scope.activeInsVideo=index;
		 if(category=="videos"){
		     $scope.displayedMaterials=$scope.data.contents.videos[index].title;
			 $scope.describedMaterial.description=$scope.data.contents.videos[index].description;
			 $scope.describedMaterial.url=$scope.data.contents.videos[index].ref;
		 }
		 else if(category=="instructions"){
		     $scope.displayedMaterials=$scope.data.contents.instructions[index].title;
			 $scope.describedMaterial.description="hello";
			 $scope.describedMaterial.url="hello";
		 }

	  }
   })
      
 /*This controller takes care of the editor view*/////////////////////////////////////////////////////////////////Tied to course controller
 .controller("editorController" , function($scope ,$rootScope ,  dataFactory , logService){
	   $scope.setFocus=function(inFocus){
	      $scope.inFocus=inFocus;
	   };

	   $scope.disableButton = function(index , category){
	      return $scope.activeEditorIndex==index && $scope.activeCategory==category;
	   }
	  //This section takes care of the switching between editor mode and normal mode for course view which has the effect of decorating the view with editing buttons
	   $scope.editorMode=true;
	   $scope.activeEditorIndex=-1;
	   
	   //This section sets active editor
	   $scope.setActiveEditor=function(index , category){
	      $scope.activeCategory=category;
		  switch(category){
  		     case "videos":
		     case "instructions":{
			     $scope.activeEditorIndex=index;
			     $scope.data.editedContentTitle=$scope.data.contents[category][$scope.activeEditorIndex].title;
			     $scope.data.editedContentBody=$scope.data.contents[category][$scope.activeEditorIndex].description;
				 break;
			 };
			 case "courseBrief":{
			     $scope.activeEditorIndex=index;
				 $scope.data.editedContentBody=$scope.data.contents[category].description;
				 break;
			 }
			 case "textBooks":
			 case "handouts":
			 case "externalReadings":
			 case "assignments":{
			     $scope.activeEditorIndex=index;
				 $scope.data.editedContentTitle=$scope.data.contents["materials"][category][index].name;
			     $scope.data.editedContentBody=$scope.data.contents["materials"][category][index].description;
			     $scope.data.editedContentUrl=$scope.data.contents["materials"][category][index].url;
				 break;
			 }
		  }
	   };
	   //This section gets the active editor index
	   $scope.getActiveEditor=function(index , category){
	      if($scope.activeEditorIndex!=-1 &&  $scope.activeEditorIndex==index){
		      switch(category){
			     case "videos":
			     case "instructions":{
				    return '/js/angularjs/components/editors/instructionsEditor.html';
				 };
				 case "courseBrief":{
				    return '/js/angularjs/components/editors/courseInfoEditor.html';
				 };
				 case "materials":{
				    return '/js/angularjs/components/editors/materialsEditor.html';
				 }
			  }
		     
		  }return "";
	   };
	   
	   //This section takes care of saving edited contents or deleting contents or cancelling editing
	   $scope.save = function(index){
		  switch($scope.activeCategory){
		     case "videos":
		     case "instructions":{
			     $scope.data.contents[$scope.activeCategory][$scope.activeEditorIndex].title=$scope.data.editedContentTitle;
			     $scope.data.contents[$scope.activeCategory][$scope.activeEditorIndex].description= $scope.data.editedContentBody;
			     break ;
			 };
			 
			 case "courseBrief":{
			     $scope.data.contents[$scope.activeCategory].description= $scope.data.editedContentBody;
			     break;
			 }
			 case "textBooks":
			 case "handouts":
			 case "externalReadings":
			 case "assignments":{
			     var temp= $scope.data.contents["materials"][$scope.activeCategory][index];
				 temp.name=$scope.data.editedContentTitle;
			     temp.description=$scope.data.editedContentBody;
			     temp.url=$scope.data.editedContentUrl;
				 $scope.data.contents["materials"][$scope.activeCategory][index]=temp;
				 break;
			 }
		  }
		  $scope.cancel();
	   };
	   
	   //this cancels the editing of content
	   $scope.cancel=function(){
	       $scope.activeEditorIndex=-1;
	   }
	   
	   //This section takes care of toggling between editor and normal view
	   $scope.edit=false;
	   
	   //This section takes care of finalizing saving changes
	   $scope.saveChanges=function(){
	      if($scope.data.contents.courseBrief.title!=""){
			  $scope.data.courseData.contents=$scope.data.contents;
			  dataFactory.setProperty("course" ,  angular.copy($scope.data.courseData));
			  $rootScope.$broadcast("saveToServer" , {client:"course" , data:angular.copy($scope.data.courseData)});
			  $scope.edit=false;
		  }
	   };
	   
	   //This section adds new item to a category
	   $scope.addNewItem=function(categoryItem){
	      switch(categoryItem){
		     case "videos":
		     case "instructions":{
			 
			    var o={};
				o.title="enter title here";
				o.description="enter contents here";
			    $scope.data.contents[categoryItem].push(o);
				break;
			 };
			 case "textBooks":
			 case "handouts":
			 case "externalReadings":
			 case "assignments":{
			    var o={};
				o.name="enter title here";
				o.description="enter contents here";
				o.url = "link here";
				$scope.data.contents["materials"][categoryItem].push(o);
				break;
			 }
		  }
	   };
	   
	   //this section takes care of deleting items from a category
	   $scope.deleteItem=function(index , category){
	      switch(category){
		     case "videos":
		     case "instructions":{
			    $scope.data.contents[category].splice(index , 1);
				break;
			 };
			 case "textBooks":
			 case "handouts":
			 case "externalReadings":
			 case "assignments":{
				$scope.data.contents["materials"][category].splice(index , 1);
				break;
			 }
		  }
	   };
	   
	   //this section takes care of editing the pricing information for a course
	   $scope.changeAccess = function(){
	      if($scope.data.contents.courseBrief.courseAccess=="free"){ 
		     $scope.data.contents.courseBrief.courseAccess="paid" ;
		  }
		  else{ 
		     $scope.data.contents.courseBrief.courseAccess="free";
			 $scope.data.contents.courseBrief.price="0";
		  }
	   }
	    /**================handles incoming events======================================**/
		   //when sub nav is changed
		   $scope.$on("changeSelection" , function(event , args){
			  if(args.context=="editor" && args.buttons["edit-existing"]){
				 $scope.activateNav("profile"); //from filter buttons controller
				 $location.path("profile");
			  }
			  else if(args.context=="editor" && args.buttons["create-new"]){
			     $scope.$emit("reset" , {});
			  }
			  else if(args.context=="editor" && args.buttons["save-changes"]){
			      $scope.saveChanges();
			  }
		   });
		   
		   //when course nav is changed
		   $scope.$on("changeCourseNav" , function(event ,args){
		      $scope.cancel();
			  $scope.materialUrl=false;
		   });
		   
		   //hides the editor and cancel edit
		    $scope.$on("undoEdit" , function(event ,args){
		      $scope.cancel();
		   });
	    /**===========================================================================**/
   })
   
   /*This controller takes care of the forum  for a specific class*///////////////////////////////////////////////////independent
 .controller("classForumController" , function($scope , $rootScope , $filter , logService){
      
	  /**============================Handles incoming events===============================**/
	  $scope.$on("dataExtracted" , function(event  , args){
	     if(args.category=="classForum"){
		    $scope.classForumData=args.data;
			$scope.userName=args.user;
			$scope.userImg=args.userImg;
		 }
	  });
	  /**===================================================================================**/
	  
	  //This line sends a broadcast message for getting the data specific to its category the  moment it is been instantialted
	  $rootScope.$broadcast("getCategoryData" , {category:"classForum"});
	  
	  //This method takes care of displaying the particular discuss
	  $scope.discussionIndex=0;
	  var temp;
	  $scope.discussion= $scope.classForumData.discussions[$scope.discussionIndex];
	  $scope.discussThis = function(index){
	     $scope.resetFilter();
	     temp=$scope.classForumData.discussions; //this is to ensure that the original menu is retrieved after the explore data has been activated on the filterd menu items
	     if(angular.isDefined($scope.filterText)){
		    $scope.classForumData.discussions=$filter("filter")($scope.classForumData.discussions , $scope.filterText);
		 }
	     $scope.discussionIndex=index;
	     $scope.discussion= $scope.classForumData.discussions[$scope.discussionIndex]; 
	  };
	  
	  //This portion of the code takes care of submitting new posts
	  $scope.submitPost=function(){
	     if(angular.isDefined($scope.newPost) && $scope.newPost.length!=0){
		     var newPostObj={};
			 newPostObj.post=$scope.newPost;
			 newPostObj.comment=[];
			 newPostObj.by=$scope.userName;
			 newPostObj.date=new Date().toDateString();
			 newPostObj.userImg=$scope.userImg;
			 $scope.classForumData.discussions[$scope.discussionIndex].description.push(newPostObj);
			 $scope.newPost="";
		 }
	  };
	  
	  $scope.resetFilter=function(){
	     if(angular.isDefined(temp)){
		    $scope.classForumData.discussions=temp;
		 }
	  }
	   //This function checks to see that the topic enter does not already exists
	  function topicExist(){
	     for(var i=0; i<$scope.classForumData.discussions.length; i++){
		    if($scope.classForumData.discussions[i].topic==$scope.newDiscussion){
			   return true;
			}
		 }
		 return false;
	  }
	  //This takes care of the addition of new topics to the class forum
	  $scope.newTopic=false;
	  $scope.inValidTopic=false;
	  
	  $scope.toggleNew=function(){
	      $scope.inValidTopic=false;
	      $scope.resetFilter();
	      if($scope.newTopic){
		     if(angular.isDefined($scope.newDiscussion) && $scope.newDiscussion.length>3 && !topicExist()){
			    var newDiscussionObj={topic:$scope.newDiscussion,description:[]};
				$scope.classForumData.discussions.push(newDiscussionObj);
				$scope.inValidTopic=false;
			 }
			 else{
			    $scope.inValidTopic=true;
			 }
		  }
	      $scope.newTopic=! $scope.newTopic;
	  };
	  
 })
 
 //this controller takes care of sub comment /////////////////////////////////////////////////////////////////////dependent on class forum controller
 .controller("subCommentController" , function($scope  , $filter){
     $scope.writeComment=false;
     //This takes care of comments within a post
	  $scope.newComment={};
	  $scope.newComment.userImg=$scope.userImg;
	  $scope.newComment.by=$scope.userName;
	  
	  $scope.submitComment=function(index){
	      if(angular.isDefined($scope.newComment.post)){
		      $scope.classForumData.discussions[$scope.discussionIndex].description[index].comment.push(angular.copy($scope.newComment));
			  $scope.newComment={"userImg":$scope.userImg , "by":$scope.userName};
		  }
          $scope.writeComment=false;
	  }
 })

   //this controller takes care of the profile////////////////////////////////////////////////////independent
   .controller("profileController" , function($scope , $rootScope , logService , dataFactory){
      //inits data from factory
      $scope.data=dataFactory.getData("profile");
	  
	  $scope.teaching=true;
	  /**==============handles incoming events======================================**/
	  $scope.$on("changeSelection" , function(event , args){
	    if(args.context=="profile"){
		   $scope.teaching=args.buttons["teaching"];
	       $scope.learning=args.buttons["learning"];
	       $scope.info=args.buttons["info"];
		   $scope.settings=args.buttons["settings"];
		}
	  });
	  /**===========================================================================**/
	  
	  //this returns the number of students taught by you
	  $scope.getStudentCount=function(){
	     var result=0;
		 for(var i=0; i<$scope.data.teaching.length; i++){
		    result+=$scope.data.teaching[i].students.count*1;
		 }
		 return result;
	  };
	  /*when the eye is clicked the course view is loaded*/
	  $scope.loadCourse=function(index , purpose){
	     $rootScope.$broadcast("getCourse" , {courseId:index , client:"profile", purpose:purpose});
	  };
	  
	  //when the pen is clicked the course is taken to the editor to be edited
	  $scope.editMyCourse = function(index){
	     $scope.loadCourse(index , "edit");
		 
	  }
	  
	  //this section takes care of editing user profile information
	  $scope.editInfo=false;
	  
	  $scope.saveInfo=function(){
	     if($scope.editInfo){
		    dataFactory.setProperty("profile" , angular.copy($scope.data));
			
		 }
         $scope.editInfo=!$scope.editInfo;
		 
	  };

   })
   
   
   //Quiz controller ////////////////////////////////////////////////////////////////////////////////independent
   .controller("quizziesController" , function($scope , $rootScope ,  $timeout ,  logService , dataFactory){
        $scope.quizzies = $scope.data.contents.quizzies; //data gotten from the course controller
		$scope.activeQuizIndex=-1;
		$scope.activeQuestionIndex=0;
		$scope.totalScore = 0;
		
		//this looks for the current position the person who just finished the quiz took
		function findPosition(name){
		   for(var i=0; i< $scope.quizzies[$scope.activeQuizIndex].participants.length; i++){
		      if($scope.quizzies[$scope.activeQuizIndex].participants[i].name==name){
			     return i;
			  }
		   }
		   return -1;
		}
		
		//this resets variables to initial state
		function reset(){
		   $scope.optionSelected=[false,false,false,false];
		   $scope.hasSelect=undefined;
		   $scope.end=false;
		   var temp = $scope.quizzies[$scope.activeQuizIndex].quiz[$scope.activeQuestionIndex].yourAns;
		   if(temp!==""){
			  $scope.optionSelected[temp]=true;
			  $scope.checkOption(temp);
		   }
		} 
		//This sorts the user in the user board from highest to lowest
		function sort(){
		   var tempData = $scope.quizzies[$scope.activeQuizIndex].participants;
			 $scope.quizzies[$scope.activeQuizIndex].participants=[];
			 var min=0;
			 while(tempData.length>0){
				 for(var i=0; i<tempData.length; i++){
					if(tempData[i].score >= tempData[min].score){
					   min=i;
					}
				 }
				 $scope.quizzies[$scope.activeQuizIndex].participants.push(tempData[min]);
				 tempData.splice(min , 1);
				 min=0;
			 }
		}
		
		
		//this sets the active quiz index
		$scope.setActiveQuiz=function(index){
		   $scope.activeQuizIndex=index;
		   $scope.activeQuestionIndex=0;
		   $scope.isOn=false;
		   $scope.grade=undefined;
		   $scope.submitted=undefined;
		   $scope.totalScore = 0; 
		   reset();
		   sort();
		   $rootScope.$broadcast("quizChanged" , {});
		}
		
		//this checks to see if the quiz does not have any questions
		$scope.isEmpty = function(){
		   if($scope.activeQuizIndex==-1){
		       return false;
		   }
		   return $scope.quizzies[$scope.activeQuizIndex].quiz.length==0;
		}
		//this goes to the next question
		$scope.prevQ = function(){
		   if($scope.activeQuestionIndex>0){ 
		      
		      $scope.activeQuestionIndex--;
			  reset();
			  if($scope.isCorrect()){
				  $scope.totalScore--;
			  } 
		   } 
		   
		}
		
		//This goes to the prev question
		$scope.nextQ  = function(){
		   $scope.submitted=false;
		   if($scope.activeQuestionIndex<$scope.quizzies[$scope.activeQuizIndex].quiz.length-1){ 
			  if($scope.isCorrect()){
				  $scope.totalScore++;
			  }
		      $scope.activeQuestionIndex++;
			  reset();
		   } else {
		      if($scope.isCorrect()){
				  $scope.totalScore++;
			  }
			  $scope.activeQuestionIndex++;
		      $scope.end=true;
		   } 
		}
		
		//this submit the answer
		$scope.submit = function(){
		   if($scope.activeQuestionIndex<$scope.quizzies[$scope.activeQuizIndex].quiz.length){
			   $scope.quizzies[$scope.activeQuizIndex].quiz[$scope.activeQuestionIndex].yourAns=$scope.hasSelect;
			   $scope.submitted=true;
			   $timeout(function(){ 
				  $scope.nextQ();
			   } , 1000);
		   }
		}
		//This sets the variabe that indicates if user is currently taking the active quiz or not
		$scope.takeQuiz=function(){
		   reset();
		   $scope.isOn=true;
		}
		
		//This selects an option i a quiz
		$scope.checkOption = function(index){
		   $scope.optionSelected=[false,false,false,false];
		   $scope.optionSelected[index]=true;
		   $scope.hasSelect = index;
		}
		
		//
		$scope.isCorrect = function(){
		   var temp =$scope.quizzies[$scope.activeQuizIndex].quiz[$scope.activeQuestionIndex];
		   return temp.yourAns==temp.answer;
		}
		
		//this grades the quiz ,  show the overall score to user and adds it to the scoreboard
		$scope.gradeQuiz = function(){
		   $scope.isOn=false;
		   $scope.grade=true;
		   $scope.user = dataFactory.getUserRef();
		   
		   var o = {"name":$scope.user.userName , "img": $scope.user.userImg, "score":$scope.totalScore};
		   if(findPosition($scope.user.userName) == -1){
		      $scope.quizzies[$scope.activeQuizIndex].participants.push(o);
		      sort();
		   }
		   
		   $scope.position = findPosition($scope.user.userName)+1;
		}
		
		/**===================== incoming events ===================*/
		  $scope.$on("questionAdded" , function(event , args){
		     if(!args.wasNewQ){
			    $scope.activeQuestionIndex = $scope.quizzies[$scope.activeQuizIndex].quiz.length-1;
			 }
		     
		  });
		  
		  $scope.$on("questionDeleted" , function(event  , args){
		     if($scope.activeQuestionIndex==$scope.quizzies[$scope.activeQuizIndex].quiz.length){
			    $scope.activeQuestionIndex--;
			 }
		  });
		  
		  $scope.$on("saveQuiz" , function(event , args){  
		      $scope.quizzies[$scope.activeQuizIndex] = args.data;
		  });
		  
		/**=========================================================*/
   })
   //this controls the editing of the quizzies////////////////////////////////////////depends on quizzies controller
   .controller("quizEditorController" , function($scope , $rootScope ,  logService){
      //Deletes the quiz at the specific index
	  $scope.deleteQuiz = function(index){
	      $scope.quizzies.splice(index , 1);
	  }
	  //deletes question in a particular quiz
	  $scope.deleteQuestion = function(){
	      $scope.quizzies[$scope.activeQuizIndex].quiz.splice($scope.activeQuestionIndex, 1);
		  $rootScope.$broadcast("questionDeleted" , {});
	  }
	  
	  //this adds new quiz to the list of quizs
	  $scope.addNewQuiz = function(){
	     var newQuiz={};
		 newQuiz.title="title of quiz";
		 newQuiz.description="what this quiz is all about";
		 newQuiz.duration="0";
		 newQuiz.quiz=[];
		 newQuiz.participants=[];
		 
		 $scope.quizzies.push(newQuiz);
		 $scope.addNewQuestion($scope.quizzies.length-1);
	  }
	  
	  //This adds a new question to a particular quiz that is being edited
	  $scope.addNewQuestion = function(active){
	     var newQ = {};
		 newQ.question = "the question you want to ask the user here";
		 newQ.options = ["option a","option b","option c","option d"];
		 newQ.answer = "";
		 newQ.yourAns = "";
		 if(active){
		    $scope.quizzies[active].quiz.push(newQ);
		 }
		 else{
		    $scope.quizzies[$scope.activeQuizIndex].quiz.push(newQ); 
		 }
		 $rootScope.$broadcast("questionAdded" , {wasNewQ:active});
		
	  }
	  
	  //this sets the active editor
	  $scope.type="";
	  $scope.edit = function(type){
	     $scope.type=type;
		 $scope.tempQuiz=angular.copy($scope.quizzies[$scope.activeQuizIndex]);
		 $scope.duration =  $scope.tempQuiz.duration;
	  }
	  //this returns the particular quiz editor either for info editing or quiz question editing
	  $scope.getQuizEditor = function(){
	     switch($scope.type){
		    case "description": return '/js/angularjs/components/editors/descriptionEditor.html';
			case "quiz": return '/js/angularjs/components/editors/questionEditor.html';
			default:return "";
		 }
	  }
	  
	  //this works with the option editing
	  $scope.ansOptions =[1 , 2 , 3  , 4 ];
	  $scope.ansIndex = 0;
	  $scope.setAnsIndex = function(index){
	     $scope.ansIndex = index;
	  }
	  
      //save the edited question
	  $scope.save = function(){
		$scope.tempQuiz.quiz[$scope.activeQuestionIndex].answer = $scope.ansIndex;
		$scope.tempQuiz.duration = $scope.duration;
		$rootScope.$broadcast("saveQuiz" , {data:$scope.tempQuiz});
		$scope.cancel();
	  }
	   
	  $scope.cancel = function(){
	     $scope.type="";
	  }
	  
	  //this takes care of editing the duration timer
	  $scope.duration = 0;
	  $scope.adjust = function(dir){
	     if(dir==-1 && $scope.duration>0){
		    $scope.duration--;
		 }
		 else if(dir==1){
		    $scope.duration++;
		 }
	  }
	  /**=====================incoming events=============*/
	   $scope.$on("quizChanged" , function(event , args){
		  $scope.type="";
	  });
	  /**=================================================*/
   });