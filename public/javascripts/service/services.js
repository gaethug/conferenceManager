/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 2:49
 * To change this template use File | Settings | File Templates.
 */

cm.factory("paramIdService", function ($q, $timeout) {
    return function(id){
        return id;
    };
});
cm.factory('Auth', function($http, $rootScope, $cookies){
    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles;
    $rootScope.User =  $cookies.user == null ? {role: userRoles.public} : angular.fromJson(unescape($cookies.user)) ;
    delete $cookies['user'];
    function changeUser(user) {
        $rootScope.User = user;
    };
    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = $rootScope.User.role;
            return accessLevel.bitMask & role.bitMask;
        },
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
                changeUser({role: userRoles.public});
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles
    };
});
cm.factory("memberDetailREST", function($resource) {
    return $resource("/members/:memberId/:childName", {}, {
        query:      {method: 'GET', cache:false}
    });
});
cm.factory("memberREST", function($resource) {
    return $resource("/members/:memberId", {}, {
        query:      {method: 'GET', cache:false},
        get:        {method: 'GET', cache:false},
        destroy:    {method: 'DELETE'},
        update:     {method: 'PUT'},
        create:     {method: 'POST'}
    });
});
cm.factory("eventREST", function($resource) {
    return $resource("", {url:"/events/:id"}, {
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

