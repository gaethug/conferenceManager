/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('eventMainCtrl',function($rootScope,$routeParams, $location, $http,$scope, eventREST){
    $scope.something = {};
    eventREST.get({id:$routeParams.eventId}, function(data){
        $scope.something = data.event;
    });
});