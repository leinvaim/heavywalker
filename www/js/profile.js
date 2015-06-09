angular.module('starter')

    .controller('ProfileCtrl', function ($scope, $ionicModal, $state, $rootScope) {

        var vm = $scope;

        vm.update = update;
        activate();

        ////

        function activate() {
            getUser();
        }

        /**
         * Gets the users profile from local storage
         * @returns {*}
         */
        function getUser() {
            vm.user = JSON.parse(window.localStorage.userID);
            // Initialize some defaults here
            // TODO put the user stuff into a service
            vm.user.name = vm.user.name || vm.user.user;
            vm.user.memberSince = vm.user.memberSince || new Date().getTime();
            return vm.user;
        }

        /**
         * Updates the users profile in local storage
         */
        function update() {
            console.log('update', window.localStorage.userID);
            window.localStorage.userID = JSON.stringify($scope.user);
            console.log('after', window.localStorage.userID);
            
            navigator.notification.alert(
                'Profile Updated', // message
                alertDismissed, // callback
                'Success', // title
                'OK' // buttonName
            );
        }

        function alertDismissed() {
            // do something
        }
    });
