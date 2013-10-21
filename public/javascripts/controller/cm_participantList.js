/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 10. 21.
 * Time: 오후 5:59
 * To change this template use File | Settings | File Templates.
 */
cm.controller('participantListCtrl',function($rootScope,$location, $http,$scope, $dialog){
    $scope.participantList = [
        {
        Email:"aa@aa.com",
        Name:"이개똥",
        Company:"JTMG",
        Depart:"사원",
        Phone:"전화번호"
    },{
        Email:"aa@aa.com",
        Name:"이개똥",
        Company:"JTMG",
        Depart:"사원",
        Phone:"전화번호"
    }];
    console.log($scope.participantList);
});