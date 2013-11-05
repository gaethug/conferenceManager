/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('eventCreateCtrl',function($rootScope,$location, $http,$scope, eventREST, Auth){
    $scope.something = [];
    $scope.createSomething = function(){
        eventREST.create({},{
                Title:$scope.something.Title,
                Memo:$scope.something.Memo,
                _Member:$rootScope.User._id
            }
            ,function(data){
                console.log(data);
                $location.path('/eventList');
            });
    };
});