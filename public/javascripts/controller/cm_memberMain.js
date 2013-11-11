/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('memberMainCtrl',function($rootScope,$routeParams,$location, $http,$scope, memberREST, memberDetailREST){
    $scope.memberId = $routeParams.memberId;
    $scope.Events = [];
    $scope.Emails = [];
    $scope.Surveys = [];
    memberREST.get({memberId:$routeParams.memberId}, function(data){
        console.log(data);
        $scope.something = data.member;

    });
    memberDetailREST.get({memberId:$routeParams.memberId, childName:"events"},function(data){
        console.log(data);
        $scope.Events = data.events;
    });
    memberDetailREST.get({memberId:$routeParams.memberId, childName:"surveys"},function(data){
        console.log(data);
        $scope.Surveys = data.surveys;
    });
    memberDetailREST.get({memberId:$routeParams.memberId, childName:"emails"},function(data){
        console.log(data);
        $scope.Emails = data.emails;
    });
    /*memberREST.get({memberId:$scope.memberId ,"childName":"surveys" },function(data){
        console.log(data);
        $scope.Surveys = data.surveys;
    });
    memberREST.get({memberId:$scope.memberId ,"childName":"emails" },function(data){
        console.log(data);
        $scope.Emails = data.emails;
    });*/
    $scope.deleteSomething = function(){
        memberREST.destroy({id:$routeParams.memberId},{},function(data){
            console.log(data);

        });
    };
});