angular.module('starter')

.controller('LeaderboardCtrl', function($scope, $ionicModal, $state, $rootScope, pedometerService) {
    $scope.user = JSON.parse(window.localStorage.userID);
    console.log('leaderboard');
    $scope.leaderboard = [{
        username: 'Jordan',
        steps: 100,
    }, {
        username: 'Darren',
        steps: 120
    }, {
        username: 'Dawood',
        steps: 111
    }, {
        username: $scope.user.username,
        steps: pedometerService.steps
    }, {
        username: 'Kelvin',
        steps: 12000
    }];
});
