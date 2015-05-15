// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngMaterial'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    // $mdThemingProvider.theme('default')
    //     .dark();
    $stateProvider

    //login state
        .state('login', {
        url: "/",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })

    //state for the menu with abstract true
    .state('sideMenu', {
            url: "/sideMenu",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'SideMenuCtrl'
        })
        //state for views insie the menu
        .state('sideMenu.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('sideMenu.leaderboard', {
            url: "/leaderboard",
            views: {
                'menuContent': {
                    templateUrl: "templates/leaderboard.html",
                    controller: 'LeaderboardCtrl'
                }
            }
        })
        .state('sideMenu.goal', {
            url: "/goal",
            views: {
                'menuContent': {
                    templateUrl: "templates/goal.html",
                    controller: 'GoalCtrl'
                }
            }
        })
        .state('sideMenu.profile', {
            url: "/profile",
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('sideMenu.setting', {
            url: "/setting",
            views: {
                'menuContent': {
                    templateUrl: "templates/setting.html",
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('sideMenu.inwalk', {
            url: "/inwalk",
            views: {
                'menuContent': {
                    templateUrl: "templates/inwalk.html",
                    controller: 'InWalkCtrl'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});
