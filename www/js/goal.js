angular.module('starter')

.controller('GoalCtrl', function($scope, $ionicModal, $state, $rootScope, goalService) {
    $scope.user = JSON.parse(window.localStorage.userID);
    console.log('calling this');
    $scope.currentGoal = goalService.getGoal();
    $scope.goal = {
    	newGoal: undefined
    }
    $scope.changeGoal = function() {
    	var convertedNewGoal = parseInt($scope.goal.newGoal);
    	console.log($scope.goal.newGoal);
    	if(convertedNewGoal > 0) {
    		goalService.setGoal(convertedNewGoal);
    		$scope.goal.newGoal = undefined;
    		$scope.currentGoal = goalService.getGoal();
    	}else {
    		$scope.goal.newGoal = undefined;
    		alert('New Goal should be greater than 0');
    	} 
    }
});
