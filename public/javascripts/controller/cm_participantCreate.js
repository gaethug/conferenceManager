/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 10. 21.
 * Time: 오후 5:59
 * To change this template use File | Settings | File Templates.
 */
cm.controller('participantCreateCtrl',function($rootScope,$location, $http,$scope, $sce){
    $scope.participant = [];
    $scope.createUser = function(){

        $http({
            url:'/participant'
            ,method:"POST"
            ,data: $.param(
                {
                    Name:$scope.participant.Name
                    ,Company:$scope.participant.Company
                    ,Depart:$scope.participant.Depart
                    ,Title:$scope.participant.Title
                }
            )
            ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
                console.log(data);
                $scope.qrcodebinary= $sce.trustAsHtml(data.qrcodeURL);
            });
    };
});