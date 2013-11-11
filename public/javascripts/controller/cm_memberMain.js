/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('memberMainCtrl',function($rootScope,$routeParams,$location, $http,$scope, memberREST){
    $scope.memberId = $routeParams.memberId;
    $scope.Events = [];
    $scope.Emails = [];
    $scope.Surveys = [];
    memberREST.get({id:$routeParams.memberId}, function(data){
        console.log(data);
        $scope.something = data.member;

    });
    /*eventREST.getByMember({memberId:$scope.memberId },function(data){
        console.log(data);
        $scope.Events = data.events;
    });
    surveyREST.getByMember({memberId:$scope.memberId },function(data){
        console.log(data);
        $scope.Surveys = data.surveys;
    });
    emailREST.getByMember({memberId:$scope.memberId },function(data){
        console.log(data);
        $scope.Emails = data.emails;
    });*/
    $scope.deleteSomething = function(){
        memberREST.destroy({id:$routeParams.memberId},{},function(data){
            console.log(data);

        });
    };
});