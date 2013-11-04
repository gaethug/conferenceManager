/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('memberListCtrl',function($rootScope,$location, $http,$scope, memberREST,memberLogin, Auth){




    memberREST.query({},function(data){
        console.log(data);
        $scope.members = data.members;
    });
    console.log(Auth.isLoggedIn());



});