/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 2:49
 * To change this template use File | Settings | File Templates.
 */
'use strict';

cm.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { role: userRoles.public };
    console.log(currentUser);
    $cookieStore.remove('user');
    function changeUser(user) {
        //console.log("+=changeUser++");
        //console.log(user);
        _.extend(currentUser, user);
        //$cookieStore.remove('user');
        //$cookieStore.put('user',user);
    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            console.log(user.role.title);
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
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
            $http.post('/auth/login').success(function(){
                changeUser({
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

cm.factory('Users', function($http) {
        return {
            getAll: function(success, error) {
                $http.get('/users').success(success).error(error);
            }
        };
    });
cm.factory("memberLogin", function($resource) {
    return $resource("/auth/login", {}, {
        login:      {method: 'POST'}
    });
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

