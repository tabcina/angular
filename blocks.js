angular.module('yourModule', ['LocalStorageModule'])
.controller('blockCtrl', [
  '$scope',
  'localStorageService',
  blockCtrl
]);  

function blockCtrl($scope, localStorageService){
  /** In Memory Data***/
  //$scope.blocks = [];
  $scope.blocks = [{title: 'First Code Snippet', 
    content: 'function reverse(my_str)  { return my_str.toLowerCase(); }', collapsed:false}];
  $scope.editIndex = -1;
  
  
  $scope.getLocalSS = function(){
    /** Local Storage Persistance **/
    var partIter=0 ;
    if(localStorageService.get('yourModule.'+partIter) !== null) {
      //alert('Cleaning current entries to retrieve previously stored blocks');
      $scope.blocks = [];
      while(localStorageService.get('yourModule.'+partIter) !== null) {
        var block = JSON.parse(localStorageService.get('yourModule.'+partIter));
        $scope.blocks.push(block);
        partIter++;        
      }
    }   
    else {
      alert('localStorageService is empty');
    }
  };
  
  $scope.clearLocalSS = function(){
    /** Clears Local Storage Persistance **/
    localStorageService.clearAll();
    /** In Memory Data***/
    $scope.blocks = [];
  };

  
	$scope.invertState = function(index){
		var colStatus = $scope.blocks[index].collapsed;
		$scope.blocks[index].collapsed = !colStatus;
	};
  
  $scope.runCode = function(){
    var funct=editor.getValue();    
    /**Not the safest but calls js engine to process the snippet*/
    var res = eval(funct);
    $scope.evaluatedResult = res;
	};
	
  
	$scope.saveBlock = function(){
    /** Editing **/
    if($scope.editIndex >= 0){

      /** In Memory Data***/
      $scope.blocks[$scope.editIndex].title = $scope.blockTitleInput;  	  
      //$scope.blocks[$scope.editIndex].content = $scope.blockContentInput;
      /** grabs the value from the ACE editor and saves it to the
      corresponding object in the array! **/
      $scope.blocks[$scope.editIndex].content = editor.getValue();
      
      /** Local Storage Persistance
      Overrides the current value at editIndex**/
      block = new Object();
      block.title=$scope.blockTitleInput;
      block.content=editor.getValue();
      block.collapsed=false;
      localStorageService.add('yourModule.'+$scope.editIndex,
        JSON.stringify(block));
      
      $scope.editIndex = -1;
    }
    /** Adding **/
    else {
      
      /** In Memory Data***/
      //With Editor
      //var lastIndex=$scope.blocks.push
      //({title:$scope.blockTitleInput, content:editor.getValue(), collapsed:false});
      
      //With TextArea
       var lastIndex=$scope.blocks.push
      ({title:$scope.blockTitleInput, content:$scope.blockContentInput, collapsed:false});
      
      /** Local Storage Persistance**/
      lastIndex--;       
      block = new Object();
      block.title=$scope.blockTitleInput;
      block.content = $scope.blockContentInput;
      //block.content=editor.getValue();
      block.collapsed=false;
      localStorageService.add('yourModule.'+lastIndex,
        JSON.stringify(block));
    
    }
		$scope.blockTitleInput = '';
    //editor.setValue(''); 
		$scope.blockContentInput = '';
	};
	
	$scope.editBlock = function(index){
		$scope.editIndex = index;
		$scope.blockTitleInput = $scope.blocks[index].title;
		
    /**Commented out so that the user edits in the editor**/
    //$scope.blockContentInput = $scope.blocks[index].content;
    $scope.blockContentInput = '<Edit the content in the editor>';
    
    //$scope.aceEditor = $scope.blocks[index].title;
    var content = $scope.blocks[index].content;
    editor.setValue(content); 
	};
	
	$scope.deleteBlock = function(index){
		if($scope.editIndex === index) {
			$scope.editIndex = -1;
		}
    
    /** In Memory Data***/
		$scope.blocks.splice(index,1);
    
     /** Local Storage Persistance**/
    localStorageService.removeFromLocalStorage('yourModule.'+index);
	};
}



