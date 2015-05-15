angular.module('starter')

.controller('LeaderboardCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.user = JSON.parse(window.localStorage.userID);
    $scope.leaderboard = [{
        username: 'Jordan',
        steps: 15000,
    }, {
        username: 'Darren',
        steps: 14999
    }, {
        username: 'Dawood',
        steps: 14989
    }, {
        username: $scope.user.user,
        steps: 10000
    }, {
        username: 'Darren',
        steps: 14999
    }];
});
