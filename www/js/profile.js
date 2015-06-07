angular.module('starter')

.controller('ProfileCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.user = JSON.parse(window.localStorage.userID);
    console.log('new', $scope.user);

    $scope.update = function() {
        console.log('update', window.localStorage.userID);
        window.localStorage.userID = JSON.stringify($scope.user);
        console.log('after', window.localStorage.userID);
        alert('Profile updated');
    }

});
