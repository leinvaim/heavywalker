angular.module('starter')

.controller('LoginCtrl', function($scope, $ionicModal, $state, $rootScope) {
    // Form data for the login modal
    var loginData = [{
        user: 'admin',
        password: 'admin',
        weight: 60,
        height: 170
    }, {
        user: 'jordan',
        password: 'jordan',
        weight: 150,
        height: 170
    }];
    $scope.enteredLogin = {};
    $scope.wrongPassword = false;
    console.log(window.localStorage);
    if (window.localStorage.userID) {
        $state.go('sideMenu.home');
    }
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        var userDetails = _.find(loginData, function(data) {
            return data.user === $scope.enteredLogin.username && data.password === $scope.enteredLogin.password;
        });
        console.log('user is', userDetails);
        if (userDetails) {
            //rootscope doesnt work? I wonder why
            $rootScope.userAccount = {
                username: $scope.enteredLogin.username,
                password: $scope.enteredLogin.password
            };
            console.log('user correct');

            window.localStorage.userID = JSON.stringify(userDetails);
            $state.go('sideMenu.home', null, {
                reload: true
            });

        } else {
            $scope.wrongPassword = true;
            console.log('login not found');
        }
    };
});
