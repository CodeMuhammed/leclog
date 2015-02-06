angular.module("customFilters" , [])
   .filter("capitalize" , function(){
      return function(data){
	        var result = [];
			angular.forEach(data.split(""), function (char, index) {
				result.push(index == 0
				? char.toString().toUpperCase() : char.toString().toLowerCase());
			});
			return result.join("")
	  }
   })
   .filter("capitalizeAll" , function($filter){
      return function(data){
	  
	    var result=[];
	    var wordArray = data.split(" ");
		
		for(var i=0; i<wordArray.length; i++){
		  result.push($filter("capitalize")(wordArray[i]));
		}
		return result.join(" ");
	  }
   })
   .filter("wordSuffix" , function(){
      return function(data){
	     if(angular.isNumber(data)){
		    var temp = "0"+data;
			if(temp[temp.length-1]=="1" && temp[temp.length-2]!=="1" ){
			   return data+"st";
			} else if(temp[temp.length-1]=="2" && temp[temp.length-2]!=="1" ){
			   return data+"nd";
			} else if(temp[temp.length-1]=="3" && temp[temp.length-2]!=="1" ){
			   return data+"rd";
			}
			else{ 
			   return data+"th";
			} 
		 }
	     return data;
	  }
   });