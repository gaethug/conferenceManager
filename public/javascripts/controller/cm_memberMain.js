/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('memberMainCtrl',function($rootScope,$routeParams,$location, $http,$scope, memberREST){
    $scope.memberId = $routeParams.memberId;
    memberREST.get({id:$routeParams.memberId}, function(data){
        $scope.something = data.member;
    });
    $scope.deleteSomething = function(){
        memberREST.destroy({id:$routeParams.memberId},{},function(data){
            console.log(data);

        });
    };
});