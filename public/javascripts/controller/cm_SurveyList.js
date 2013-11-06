/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('surveyListCtrl',function($rootScope,$location, $http,$scope, surveyREST, Auth){
    surveyREST.query({},function(data){
        console.log(data);
        $scope.somethings = data.surveys;

    });
});