/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 10. 6.
 * Time: 오후 2:45
 * To change this template use File | Settings | File Templates.
 */
ttwr.controller('SitemapListCtrl',function($rootScope, $location, $http,$scope,$timeout, $dialog){
    $scope.posts  = [] ;
    var getPostList = function(){
        $http({method: 'GET', url: '/posts',headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                $scope.posts = data.posts;
                $timeout(function(){
                    $scope.ready();
                },1000);
            }).
            error(function(data, status, headers, config) {
            });
    };
    getPostList();
});