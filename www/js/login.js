angular.module('starter')

.controller('LoginCtrl', function($scope, $ionicModal, $state, $rootScope) {
    // Form data for the login modal
    var loginData = {
        user: 'admin',
        password: 'admin'
    };
    $scope.enteredLogin = {};
    $scope.wrongPassword = false;
    console.log(window.localStorage);
    if (window.localStorage.userID) {
      $state.go('sideMenu.home');
    }
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log($state);
        if ($scope.enteredLogin.username === loginData.user && $scope.enteredLogin.password === loginData.password) {
            $rootScope.userAccount = {
              username: $scope.enteredLogin.username,
              password: $scope.enteredLogin.password
            };
            console.log('user correct');
            window.localStorage.userID = JSON.stringify($scope.enteredLogin);
            console.log($rootScope);
            $state.go('sideMenu.home', null, {reload: true});

        } else {
            $scope.wrongPassword = true;
        }
    };
});