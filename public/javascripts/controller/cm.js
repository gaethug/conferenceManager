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
    }).config(function($routeProvider, $locationProvider) {

        $routeProvider.
            when('/', {templateUrl:'/fragments/main/main'}).
            when('/participantCreate', {controller:'participantCreateCtrl', templateUrl:'/fragments/participant/create'}).
            when('/participantList', {controller:'participantListCtrl', templateUrl:'/fragments/participant/list'}).
            otherwise({redirectTo:'/'});
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    }).config(function($httpProvider){
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
    });

cm.controller('MainCtrl',function($rootScope,$location, $http,$scope, $dialog){

});