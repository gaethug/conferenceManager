/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('emailCreateCtrl',function($rootScope,$location, $http,$scope, emailREST, Auth){
    //큰 메뉴에서 만드는 건지 이벤트에서 만드는 건지 구분해야 한다.

    $scope.something = [];
    $scope.createSomething = function(){
        /*emailREST.create({},{
                Title:$scope.something.Title,
                Memo:$scope.something.Memo,
                _Member:$rootScope.User._id
            }
            ,function(data){
                console.log(data);
                $location.path('/eventList');
            });*/
    };
});