/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('emailCreateCtrl',function($rootScope,$routeParams,$location, $http,$scope, emailREST, Auth){
    //큰 메뉴에서 만드는 건지 이벤트에서 만드는 건지 구분해야 한다.
    $scope.eventId = null;
    $scope.myParent = "";
    if($routeParams.eventId == null){
        //멤버가 직접 설문 생성
        $scope.myParent = "멤버에 의한 설문 생성";
    }else{
        //이벤트에 속한 설문
        $scope.eventId = $routeParams.eventId;
        $scope.myParent = "이벤트에 의한 설문 생성";
    }
    console.log($scope.eventId);
    $scope.createSomething = function(){
        emailREST.create({},{
                Title:$scope.something.Title,
                Memo:$scope.something.Memo,
                _Event:$scope.eventId
            }
            ,function(data){
                console.log(data);
                if($scope.eventId == null){
                    $location.path('/emailList');
                }else{
                    $location.path('/eventMain/'+$scope.eventId);
                }
            });
    };
});