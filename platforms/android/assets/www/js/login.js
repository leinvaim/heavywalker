angular.module('starter')

.controller('LoginCtrl', function($scope, $ionicModal, $state, $rootScope, $http) {
    $scope.enteredLogin = {};
    $scope.wrongPassword = false;

    if (window.localStorage.userID) {
        $state.go('sideMenu.home');
    }
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        var userDetails = false, // no user logged in yet
            loginAttempt = 'username=' + $scope.enteredLogin.username + 
                           '&password=' + $scope.enteredLogin.password,
            postUrl = 'http://heavywalkersapi.esy.es/checkLogin';
        
        $http({
            method: 'POST',
            url: postUrl,
            data: loginAttempt,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(response) {
            if (response.status = 200) {
                if (response.data.status == "succeeded") {
                    // successful login
                    userDetails = response.data;
                    delete userDetails.status; // don't need status of login in the userDetails object
                   
                    window.localStorage.userID = JSON.stringify(userDetails);
                    console.log(window.localStorage.userID);
                    $state.go('sideMenu.home', null, {
                        reload: true
                    });
                } else {
                   $scope.wrongPassword = true;
                }
             }
        });
    };
});
