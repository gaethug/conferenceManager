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
            when('/eventMain/:eventId', {controller:'eventMainCtrl',templateUrl:'/fragments/event/main', access : access.public}).
            when('/eventCreate', {controller:'eventCreateCtrl',templateUrl:'/fragments/event/create', access : access.user}).

            when('/emailList', {controller:'emailListCtrl',templateUrl:'/fragments/email/list', access : access.public}).
            when('/emailMain/:emailId', {controller:'emailMainCtrl',templateUrl:'/fragments/email/main', access : access.public}).
            when('/emailCreate', {controller:'emailCreateCtrl',templateUrl:'/fragments/email/create', access : access.user}).

            when('/surveyList', { controller:'surveyListCtrl',templateUrl:'/fragments/survey/list', access : access.public}).
            when('/surveyMain/:surveyId', { controller:'surveyMainCtrl',templateUrl:'/fragments/survey/main', access : access.public}).
            when('/surveyCreate', { controller:'surveyCreateCtrl',templateUrl:'/fragments/survey/create', access : access.user}).

            otherwise({redirectTo:'/', access : access.public});
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        //응답을 캐치하여 203일 경우 loginRequried 호출
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
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()){
                    alert("권한엄슴");
                    $location.path('/');
                }else{
                    alert("로그인 후 이용해 주셍");
                    $location.path('/');
                    //$rootScope.$broadcast('plzShowLoginPopup');
                    //$location.path('/login');
                }
            }

        });
        $rootScope.$on('loginRequired', function() {
            if(Auth.isLoggedIn()){
                Auth.ping();    //클라이언트는 지가 로그인 상태 인줄 알지만 203이 날라온 경우, 서버 세션 만료, 클라이언트는 모르는 상태
                                //핑을 날려 최신 유져상태 유지
            }else{
                $rootScope.User = {role:Auth.userRoles.public};
            }

        });
        $rootScope.$on('plzShowLoginPopup', function(){
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
    //$scope.User = Auth.user;
    $scope.showLoginModal = function(){

        $rootScope.$broadcast('plzShowLoginPopup');
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
