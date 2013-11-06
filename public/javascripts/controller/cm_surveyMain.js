/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('surveyMainCtrl',function($rootScope,$routeParams,$location, $http,$scope, surveyREST, Auth){
    $scope.surveyId = $routeParams.surveyId;
    surveyREST.get({id:$routeParams.surveyId}, function(data){
        $scope.something = data.survey;
    });
});