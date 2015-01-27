/*Note in this encryption algorithm , 0 is taken as a symbol not a digit to maintain the integrity of the password*/
angular.module("isubset")
   .value("_MULTIPLIER" , 88)
   .controller("cryptController" , function($scope , _MULTIPLIER){
	   
      //helper functions up here
      var alpha = "abcdefghijklmnopqrstuvwxyz";
	  var alphaObj={};
	  for(var i=0; i<alpha.length; i++){
	     alphaObj[angular.lowercase(alpha[i])]=true;
	  }
	  function isAlpha(ch){
	     if(alphaObj[ch]){
		    return true;
		 }
	     return false;
	  }
	  
	  //this method returns a shifted alphabet to the right
	  function getAlpha(ch){
	     var temp=ch;
		 ch=angular.lowercase(ch);
	     var index=0;
		 for(var i=0; i<alpha.length; i++){
		    if(alpha[i]==ch){index=i}
		 } 
		 var result=alpha[(index+10)%26];
		
		 if(temp==angular.lowercase(temp)){
		    return result;
		 }
		 else {
		    return angular.uppercase(result);
		 }
		 
	  }
	  
	  //this converts the number to base 16
	  //@TODO
	  //hexString=yourNum.toString(16)
	  //num = parseInt(num , 18);
	  function base16(num){
	     return num.toString(16);
	  }
	  
	  /*==========main code==============================*/
      $scope.encrypt=function(){
	     decant();
		 mapNum();
		 shiftAlpha();
		 reverseSym();
	     $scope.result = decantedObj.num+decantedObj.alpha+decantedObj.sym;
		 $scope.reset();
	  }
	  $scope.reset=function(){
		 decantedObj = {num:"" , alpha:"" , sym:""};
		 $scope.password="";
	  }
	 /*==================================================*/
	  
	  //STEP 1 : decant the passsord into an object containg three layers digits alpha symbols
	  var decantedObj  = {num:"" , alpha:"" , sym:""};
	  function decant (){
		 for(var i=0; i<$scope.password.length; i++){
		    var ch=$scope.password[i];
		    if(parseInt(ch)){
			   decantedObj.num+=ch;
			}
			else if(isAlpha(angular.lowercase(ch))){
			   decantedObj.alpha+=ch;
			}
			else{
			   decantedObj.sym+=ch;
			}
		 }
	  }
	  
	  //STEP 2 : multiply each of the digit in the mumber property of the decanted obj by 88 and sum it up then convert to base 16
	  function mapNum(){
	     var numStr=decantedObj.num;
		 var result=0;
		 for(var i=0; i<numStr.length; i++){
		    result+=numStr[i]*_MULTIPLIER;
		 }
		 if(decantedObj.num!=""){
		    decantedObj.num=base16(result);
		 } 
	  }
	  
	  //STEP 3 : shift alphabets in the alpha property  to the right by 10
	  function shiftAlpha(){
	     var result="";
		 var alphaStr=decantedObj.alpha;
		 for(var i=0; i<alphaStr.length; i++){
		    var ch=alphaStr[i];
			result+=getAlpha(ch);
		 }
		 decantedObj.alpha=result;
	  }
	  
	  //STEP 4 : reverse symbols in the symbol property
	  function reverseSym(){
	     var result="";
		 var symStr=decantedObj.sym;
		 for(var i=symStr.length-1; i>=0; i--){
		    result+=symStr[i];
		 }
		 decantedObj.sym=result;
	  }
	  
   });