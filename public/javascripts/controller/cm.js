/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 10. 21.
 * Time: 오후 5:22
 * To change this template use File | Settings | File Templates.
 */
var cm = angular.module('CM',['ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch', 'ui.bootstrap.rating',
        'ui.bootstrap.progressbar', 'ui.bootstrap.datepicker', 'ui.bootstrap.tabs','ui.bootstrap.popover', 'ui.event','ui.bootstrap.dialog', 'ui.map'])
    .config(function($dialogProvider){
        $dialogProvider.options({backdropClick: false, dialogFade: true});
    }).config(function($routeProvider, $locationProvider,$httpProvider) {
        var access = routingConfig.accessLevels;
        $routeProvider.
            when('/', {templateUrl:'/fragments/main/main', access : access.user}).
            /*when('/participantCreate', {controller:'participantCreateCtrl', templateUrl:'/fragments/participant/create'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).*/
            /*when('/basic', {templateUrl:'/fragments/participant/basic'}).
            when('/layout', {templateUrl:'/fragments/participant/layout'}).
            when('/common', {templateUrl:'/fragments/participant/common'}).
            when('/element', {templateUrl:'/fragments/participant/element'}).
            when('/basic', {templateUrl:'/fragments/participant/basic'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).*/
            when('/memberJoin', {controller:'memberJoinCtrl', templateUrl:'/fragments/member/create', access : access.admin}).
            when('/memberList', {controller:'memberListCtrl', templateUrl:'/fragments/member/list', access : access.admin}).
            when('/eventList', {controller:'participantListCtrl', templateUrl:'/fragments/event/list', access : access.user}).
            when('/emailList', {controller:'participantListCtrl', templateUrl:'/fragments/email/list', access : access.user}).
            when('/surveyList', {controller:'participantListCtrl', templateUrl:'/fragments/survey/list', access : access.user}).
            otherwise({redirectTo:'/'});
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        var interceptor = ['$rootScope','$location', '$q', function($rootScope,$location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {

                if(response.status === 401) {
                    //$location.path('/login');
                    $rootScope.$broadcast('loginRequired');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function(promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);


    }).run(function($rootScope, $location, $dialog, Auth){
        var access = routingConfig.accessLevels;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()){
                    console.log("logged In");
                }else{
                    console.log("logged Out");
                    $rootScope.$broadcast('loginRequired');
                }
            }
        });
        $rootScope.$on('loginRequired', function() {
            $dialog.dialog({
                templateUrl:  '/fragments/common/logginModal',
                controller: 'loginCtrl'
            }).open().then(function(result){
                    if(result!="FAIL"){
                    }
                });
        });
    });

cm.controller('MainCtrl',function($rootScope,$location, $http,$scope, $dialog, Auth){
    $scope.user  = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    console.log($scope.user);
    console.log($scope.userRoles);
    console.log($scope.accessLevels);


    $scope.showLoginModal = function(){
        $rootScope.$broadcast('loginRequired');
    };
    $scope.logout = function(){
        Auth.logout( function(data){
            console.log(data);

        },function(err){
            console.log(err);
        });
    };
});
cm.controller('loginCtrl',function($rootScope,$location, $http,$scope, dialog, Auth){
    $scope.close = function(){dialog.close();};
    $scope.login = function(){
        Auth.login({
            Id:$scope.member.Id,
            Password:$scope.member.Password
        }, function(data){
            console.log(data);
            $scope.close();
        },function(err){
            console.log(err);
        });
    };
    $scope.join = function(){
        $location.path('/memberJoin');
        $scope.close();
    };
});
