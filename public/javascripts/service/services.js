/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 2:49
 * To change this template use File | Settings | File Templates.
 */


cm.factory('Auth', function($http, $rootScope, $cookies){
    $rootScope.User = angular.fromJson(unescape($cookies.user)) || {};
    delete $cookies['user'];
    function changeUser(user) {
        $rootScope.User = user;
    };
    return {
        ping: function(){
            $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
                url: "/ping"}).success(function(data){
                    changeUser(data.user);
            });
        },
        isLoggedIn: function() {
            return $rootScope.User.Name == null ? false : true;
        },
        register: function(user, success, error) {
            $http.post('/members', user).success(function(res) {
                changeUser(res.user);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/auth/login', user).success(function(user){
                changeUser(user.user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/auth/logout').success(function(){
                console.log('logout');
                changeUser({});
                success();
            }).error(error);
        }
    };
});
cm.factory("memberREST", function($resource) {
    return $resource("/members/:id", {}, {
        query:      {method: 'GET', cache:false},
        get:        {method: 'GET', cache:false},
        destroy:    {method: 'DELETE'},
        update:     {method: 'PUT'},
        create:     {method: 'POST'}
    });
});
cm.factory("eventREST", function($resource) {
    return $resource("/events/:id", {}, {
        query:      {method: 'GET', cache:false},
        get:        {method: 'GET', cache:false},
        destroy:    {method: 'DELETE'},
        update:     {method: 'PUT'},
        create:     {method: 'POST'}
    });
});
cm.factory("surveyREST", function($resource) {
    return $resource("/surveys/:id", {}, {
        query:      {method: 'GET', cache:false},
        get:        {method: 'GET', cache:false},
        destroy:    {method: 'DELETE'},
        update:     {method: 'PUT'},
        create:     {method: 'POST'}
    });
});
cm.factory("emailREST", function($resource) {
    return $resource("/emails/:id", {}, {
        query:      {method: 'GET', cache:false},
        get:        {method: 'GET', cache:false},
        destroy:    {method: 'DELETE'},
        update:     {method: 'PUT'},
        create:     {method: 'POST'}
    });
});

