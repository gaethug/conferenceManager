/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('memberJoinCtrl',function($rootScope,$location, $http,$scope, Auth, $route){
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.joinMember = function(){
        Auth.register({
            Name:$scope.member.Name,
            Id:$scope.member.Id,
            Password:$scope.member.Password,
            role:$scope.member.role
        }, function(data){
            console.log(data);
            //$location.path('/');
            location.href="/";
        },function(err){
            console.log(err);
        });
        /*memberREST.create({},{
                Name:$scope.member.Name,
                Id:$scope.member.Id,
                Password:$scope.member.Password
            }
            ,function(data){
                console.log(data);
                $location.path('/');
            });*/
    };
});