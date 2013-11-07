/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('emailMainCtrl',function($rootScope,$routeParams, $location, $http,$scope, emailREST, Auth){
    $scope.emailId = $routeParams.emailId;
    emailREST.get({id:$routeParams.emailId}, function(data){
        $scope.something = data.email;
    });
    $scope.deleteSomething = function(){
        emailREST.destroy({id:$routeParams.emailId},{},function(data){
            console.log(data);

        });
    };
});