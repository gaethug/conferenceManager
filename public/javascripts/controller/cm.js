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
            when('/', {templateUrl:'/fragments/main/main', access : access.public}).
            /*when('/participantCreate', {controller:'participantCreateCtrl', templateUrl:'/fragments/participant/create'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).*/
            /*when('/basic', {templateUrl:'/fragments/participant/basic'}).
            when('/layout', {templateUrl:'/fragments/participant/layout'}).
            when('/common', {templateUrl:'/fragments/participant/common'}).
            when('/element', {templateUrl:'/fragments/participant/element'}).
            when('/basic', {templateUrl:'/fragments/participant/basic'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).*/
            when('/memberJoin', {controller:'memberJoinCtrl', templateUrl:'/fragments/member/create', access : access.anon}).
            when('/memberList', {controller:'memberListCtrl', templateUrl:'/fragments/member/list', access : access.admin}).
            when('/eventList', {controller:'eventListCtrl',templateUrl:'/fragments/event/list', access : access.public}).
            when('/emailList', {controller:'emailListCtrl',templateUrl:'/fragments/email/list', access : access.public}).
            when('/surveyList', { controller:'surveyListCtrl',templateUrl:'/fragments/survey/list', access : access.public}).
            otherwise({redirectTo:'/'});
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        var interceptor = ['$rootScope','$q', function(scope, $q) {
            function success(response) {
                var status = response.status;
                if(response.config.url!=="/ping"){
                    if(status == 203){
                        scope.$broadcast('loginRequired');
                    }
                }
                return response;
            }
            function error(response) {
                return $q.reject(response);
            }
            return function(promise) {
                return promise.then(success, error);
            }

        }];
        $httpProvider.responseInterceptors.push(interceptor);

    }).run(function($rootScope, $location, $http, Auth, $dialog){
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
        });
        $rootScope.$on('loginRequired', function() {
            if(Auth.isLoggedIn()){
                Auth.ping();    //클라이언트에서 로그인 상태인데 203이 떨어진다면 - 서버 세션 만료, 클라이언트는 모르는 상태
                                //핑을 날린다.
            }else{
                $rootScope.User = {};
            }

        });
    });

cm.controller('MainCtrl',function($rootScope,$location, $http,$scope, $dialog, Auth){
    //$scope.User = Auth.user;
    $scope.showLoginModal = function(){
        $dialog.dialog({
            templateUrl:  '/fragments/common/logginModal',
            controller: 'loginCtrl'
        }).open().then(function(result){
                if(result!="FAIL"){

                }
            });
        //$rootScope.$broadcast('loginRequired');
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
