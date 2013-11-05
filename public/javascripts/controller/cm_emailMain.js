/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('emailMainCtrl',function($rootScope,$location, $http,$scope, emailREST, Auth){
    emailREST.query({},function(data){
        console.log(data);
    });
});