angular.module('starter')

.controller('SideMenuCtrl', function($scope, $ionicModal, $state, $rootScope) {
$scope.logout = function () {
    window.localStorage.clear();
    console.log('Logout', window.localStorage);
    $state.go('login');
}
    
});