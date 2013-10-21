/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 7. 31.
 * Time: 오후 7:38
 * To change this template use File | Settings | File Templates.
 */
    /*'ngRoute', 'ngSanitize','ngResource' ,*/
var ttwr = angular.module('TTWR',['ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch', 'ui.bootstrap.rating',
        'ui.bootstrap.progressbar', 'ui.bootstrap.datepicker', 'ui.bootstrap.tabs','ui.bootstrap.popover', 'ui.tinymce', 'ui.event','ui.bootstrap.dialog', 'ui.map', 'angles'])
.config(function($dialogProvider){
        $dialogProvider.options({backdropClick: false, dialogFade: true});
}).config(function($routeProvider, $locationProvider) {

        $routeProvider.
            //when('/', {controller:'ListCtrl', templateUrl:'index'}).
            //when('/', {controller:'ListCtrl', templateUrl:'fragments/list'}).
            when('/post/:id', {controller:'PostCtrl', templateUrl:'/fragments/post/post'}).
            when('/postList', {controller:'ListCtrl', templateUrl:'/fragments/post/list'}).
            when('/survey/:id', {controller:'SurveyCtrl', templateUrl:'/fragments/survey/survey'}).
            when('/surveyCreate', {controller:'SurveyCreateCtrl',templateUrl:'/fragments/survey/create'}).
            when('/surveyList', {controller:'SurveyListCtrl', templateUrl:'/fragments/survey/list'}).
            when('/etcList', {controller:'EtcListCtrl', templateUrl:'/fragments/etc/list'}).
            when('/formCreate', {controller:'FormCreateCtrl', templateUrl:'/fragments/form/create'}).
            when('/subbrandList', {templateUrl:'/fragments/subbrand/list'}).
            when('/sitemap', {controller:'SitemapListCtrl',templateUrl:'/fragments/sitemap/list'}).
            otherwise({redirectTo:'/postList'});
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    }).config(function($httpProvider){
        var interceptor = ['$rootScope','$q', function(scope, $q) {
            function success(response) {
                var status = response.status;
                if(response.config.url!=="/ping"){
                    if(status == 203){
                        scope.$broadcast('loginRequired');
                    }
                 }
                return response;
            }
            function error(response) {
                return $q.reject(response);
            }
            return function(promise) {
                return promise.then(success, error);
            }

        }];
        $httpProvider.responseInterceptors.push(interceptor);
});
ttwr.run(function($rootScope,  $route, $http){
    $rootScope.chatList = [];
    $rootScope.User = {};
    //이제 포스트 메뉴는 여기서 집도ㅓ한다.
    $rootScope.PostTabs = [
        {title:"IT/개발",name:"IT"},
        {title:"음악",name:"MUSIC"},
        {title:"탐방",name:"VISIT"},
        {title:"기타",name:"ETC"}
    ];
    $rootScope.TabTheme = "success";
    $rootScope.$on('loginRequired', function() {
        console.log('loginRequired!!');
        if($rootScope.User.displayName == null){
            ping(null);
        }else{
            $rootScope.User = {};
        }

    });

    //for Snapshot
    var _getTopScope = function() {
        return $rootScope;
        //return angular.element(document).scope();
    };
    $rootScope.ready = function() {
        var $scope = _getTopScope();
        $scope.status = 'ready';
        if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.loading = function() {
        var $scope = _getTopScope();
        $scope.status = 'loading';
        if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.$on('$routeChangeStart', function() {
        _getTopScope().loading();
    });

    var opts = {
        lines: 13, // The number of lines to draw
        length: 16, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: -1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed:1.2, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '150', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = angular.element('.realBody')[0];
    var spinner = new Spinner(opts).spin(target);
    spinner.stop();
    $rootScope.$on('progress:spinStart', function() {
        spinner.spin(target);
    });
    $rootScope.$on('progress:spinStop', function() {
        spinner.stop();
    });
    var ping = function(callback) {
        //console.log('ping!!');
        $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
            url: "/ping"}).success(function(data){
                $rootScope.User = data.user;
                if(data.user.displayName){
                    if(data.user.provider=="google"){
                        //do Nothing
                        /*var raw = angular.fromJson(data.user._raw);
                        $rootScope.User.profileUrl = raw.link;
                        $rootScope.User.picture = raw.picture;*/
                    }else if(data.user.provider=="facebook"){
                        //페이스 북은 -_- 프로필 사진을 따로 받아와야 함
                        $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
                            url: "https://graph.facebook.com/"+$rootScope.User.id+"?fields=picture"}).success(function(data){
                                $rootScope.User.picture = data.picture.data.url;
                            }).error(function(){
                                $rootScope.User.picture = "/images/icon.png";
                            });
                    }

                }
                //console.log($rootScope.User);
            });
    }
    ping();
    (function() {
        var e = document.createElement('script');
        e.async = true;
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        document.getElementById('fb-root').appendChild(e);
    }());
    window.fbAsyncInit = function() {
        FB.init({
            appId: '155622374644188',
            status: true,
            cookie: true,
            xfbml: true
        });
        FB.Event.subscribe('edge.create', function(url) {
            _gaq.push(['_trackSocial', 'facebook', 'like', url]);
        });
        FB.Event.subscribe('edge.remove', function(url) {
            _gaq.push(['_trackSocial', 'facebook', 'unlike', url]);
        });
    };

   /* var socket = io.connect('http://localhost');
    socket.on('connect', function(){
        console.log("Connect To Server SockIO");
    }); // 연결되면 발생하는 리스터
    socket.on('message', function(msg){
        $rootScope.chatList.push(msg);
        console.log(msg);
    }); // 서버로부터 메시지를 받으면 발생하는 리스너
    socket.on('disconnect', function(){console.log("Dissconnecttt");}); // 연결이 종료되면 발생하는 이벤트 리스터

    socket.send('Hello world!'); // 서버로 메시지 전송*/

});
ttwr.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

ttwr.controller('MainCtrl',function($rootScope,$location, $http,$scope, $dialog){
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'post';
        var qTabs = ['post','survey','etc', 'subbrand'];
        var currentPage = '';
        for(var i = 0; i < qTabs.length; i++){
            if(!!(~currentRoute.indexOf(qTabs[i]))){            //비트연산을 통한 트루펄스 검출 !!(~currentRoute.indexOf(qTabs[i]))
                currentPage = qTabs[i];
            }
        }
        switch(currentPage){
            case "post":
                $rootScope.TabTheme = "success";
                break;
            case "subbrand":
                $rootScope.TabTheme = "default";
                break;
            case "survey":
                $rootScope.TabTheme = "warning";
                break;
            case "etc":
                $rootScope.TabTheme = "info";
                break;
        }
        return page === currentPage ? 'active' : '';
    };
    $scope.goMain = function(){
        $location.path('/');
    };
    /*$scope.showAnimate = function(){
        angular.element('.glyphicon-tree-deciduous').transition({ scale: 2.0 }).transition({ scale: 1.0 });
    };*/
    /*$scope.facebookLogin = function(){
        $dialog.messageBox("Message", "'페이스북 인증 API'에서 지원하는 스펙 중 가장 최소한의 페이스북 정보에만 접근합니다. 인증을 위한 것이기 때문에 개인 정보를 수집하지 않습니다.(단, 글을 쓰거나 댓글을 남길 때 <이름, id, 개인 페이스북 url> 정보만 저장됩니다.)", [
                {result: 'cancel', label: 'Cancel'},{result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
            .open().then(function (result) {
                if(result==='ok'){
                    //$location.path("/auth/facebook");
                    $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
                        url: "/auth/facebook"}).success(function(data){});
                }
            });// //
    };*/

    $scope.authFacebook = function(){
        $http({method: 'GET', url: '/auth/facebook',headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    };
});
ttwr.controller('YoutubeInsertCtrl',function($scope,$timeout, $http, $filter,$rootScope,  dialog, $dialog){
    $scope.youtubeId = "";

    $scope.close = function(){dialog.close("FAIL");};
    $scope.insertYoutube = function(){
        if($scope.youtubeId.length > 0){
            dialog.close($scope.youtubeId);
        }
    }
});
ttwr.controller('MusicLinkInsertCtrl',function($scope,$timeout, $http, $filter,$rootScope,  dialog, $dialog){
    $scope.musicLink = "";

    $scope.close = function(){dialog.close("FAIL");};
    $scope.insertLink = function(){
        if($scope.musicLink.length > 0){
            dialog.close($scope.musicLink);
        }
    }
    var AudioPlayer  = null;
    $timeout(function(){
        AudioPlayer= angular.element('#AudioPlayer');
    },0);
    $scope.$watch('musicLink',function(newVal){
        if(newVal != null || newVal != ""){
            if(AudioPlayer == null) return false;
            AudioPlayer.find('source').remove();
            $("<source>").attr("src", $scope.musicLink).appendTo(AudioPlayer);
            AudioPlayer[0].load();
            AudioPlayer[0].play();
        }
    });


});
ttwr.filter('searchfilter', function() {
    return function(items, search) {
        var searchText = search;
        if (!searchText || searchText.length==0) {
            return items;
        }
        var retunedItem = [];
        angular.forEach(items, function(item){
            if(item.Contents.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 || item.Title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
                retunedItem.push(item);
            }
        });
        return retunedItem;
    };
});
ttwr.directive('timeago',function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModel) {
            /*scope.$watch(ngModel.$modelValue,function(newValue){
                if(newValue != null){
                    elm.text(moment(newValue).fromNow());
                }
            });*/
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function(newValue) {
                if(newValue != null){
                    elm.text(moment(newValue).fromNow());
                }
            });
        }
    };
});
ttwr.directive('togglepanel',function() {
    var tpl = '<button class="btn btn-default btn-xs" ng-click="togglePanel()"><span class="glyphicon glyphicon-minus"></span></button>';
    return {
        restrict: 'E',
        scope:{togglePanel:'&'},
        replace:true,
        template: tpl,
        link: function(scope, elm, attrs) {
            scope.togglePanel = function(){
                if(elm.parents('.panel').find('.panel-body').css("display") == "none"){
                    elm.parents('.panel').find('.panel-body').slideDown(function(){
                        elm.find('span').toggleClass('glyphicon-fullscreen glyphicon-minus');
                    });
                } else {
                    elm.parents('.panel').find('.panel-body').slideUp(function(){
                        elm.find('span').toggleClass('glyphicon-minus glyphicon-fullscreen');
                    });
                }
            };
        }
    };
});
ttwr.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
        return {
            link: function(scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function(value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function() {
                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function() {
                    return $window.off('scroll', handler);
                });
                return $timeout((function() {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    }
]);

/*ttwr.directive('myLoadingSpinner', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            loading: '=myLoadingSpinner'
        },
        template: '<div><div ng-show="loading" class="my-loading-spinner-container"></div>'+
                    '<div ng-hide="loading" ng-transclude></div></div>',
        link: function(scope, element, attrs) {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors

                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };
            var spinner = new Spinner(opts).spin();
            var loadingContainer = element.find('.my-loading-spinner-container')[0];
            loadingContainer.appendChild(spinner.el);
        }
    };
});*/
ttwr.directive('fileupload',function($timeout, $rootScope) {
    return {
        require: '?ngModel',
        transclude: true,
        link: function(scope, elm, attr, ngModel) {
            $timeout(function () {
                elm.fileupload({
                    //add:function(){$rootScope.$broadcast('progress:spinStart');},
                    url: attr.url,
                    dataType:'json',
                    done:function (e, data) {   //파일 업로드 완료
                        scope.$apply(function(){
                            //console.log(data);
                            //$rootScope.$broadcast('progress:spinStop');
                            if(data.result.result!="OK"){
                                data.result.result = "FAIL";
                            }
                            ngModel.$setViewValue(data.result);

                        });
                    }
                });
            },0);
        }
    };
});
ttwr.directive('fbLike', function ($timeout) {
    return {
        restrict: 'C',
    link: function (scope, element, attributes) {
        $timeout(function () {
            return typeof FB !== "undefined" && FB !== null ? FB.XFBML.parse(element.parent()[0]) : void 0;
        },0);
    }
    };
});
ttwr.directive('utilsPinter',function($rootScope, $timeout){
    return {
        link: function (scope, elem, attrs) {
            var initFinter = function(){
                console.log(scope.masonryElem);
                scope.masonryElem = new Masonry(elem[0]
                    ,{
                        itemSelector: '.utils-pinteritem'
                        ,transitionDuration:'1s'
                    }
                );
                scope.masonryElem.layout();
            };
            $timeout(function () {
                initFinter();
            },0);
        }
    };
});
ttwr.directive('utilsPinteritem',function($compile){
    return {
        require: 'ngModel',
        restrict: 'C',
        link: function (scope, elem, attrs, ngModel) {
            var stripTags = function  (post, allowed) {
                var input = post.Contents;
                allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

                var stripTag = input.replace(/&nbsp;/g,'').replace(commentsAndPhpTags, '').replace(tags, function ($0, $1){return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';});
                var imgSrc = (input.match(/<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/)||"");
                if(imgSrc!= ""){
                    imgSrc = imgSrc[1]+"?"+Math.random();
                }
                post.Contents = stripTag.substr(0,150);
                post.AttachedImg = imgSrc;
                elem.imagesLoaded(function () {
                    /*elem.unbind('mouseenter').bind('mouseenter', function(){
                        scope.showAnimate(attrs.index);
                    });*/
                    scope.masonryElem.reloadItems();
                    scope.masonryElem.layout();
                });

            };

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function(newValue) {
                if(newValue != null){
                    if(newValue._id != null){   //메뉴바는 안타게
                        setTimeout(stripTags(newValue, null),0);
                    }else{
                        /*elem.unbind('mouseenter').bind('mouseenter', function(){
                            scope.showAnimate(attrs.index);
                        });*/
                    }
                }
            });
        }
    };
});
ttwr.directive('stamp',function($timeout){
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            $timeout(function () {
            elem.imagesLoaded(function () {


                    //scope.masonryElem.layoutItems(elem[0],false);
                    //scope.masonryElem.layout();
                    console.log(elem);
            });
            },0);

        }
    };
});
/*ttwr.directive('tagCloud', function ($timeout) {
    return {
        restrict: 'E',
        scope: {tagList:'&'},
        template:'<a ng-click="setTag(tag)" ng-repeat="tag in tagList" rel="0">{{tag}}</a>',
        link: function (scope, element, attributes) {
            element.default={size: {start: 14, end: 18, unit: 'pt'},
                color: {start: '#cde', end: '#f52'}};

            scope.$watch('tagList', function(newVal){
                if(scope.tagList.length > 0){
                    element.tagcloud();
                }
            });
        }
    };
});*/
/*

ttwr.animation('repeat-enter',  function() {
    return {
        setup : function(element) {
            jQuery(element).css({ 'line-height': 0 });
        },
        start : function(element, done, memo) {
            jQuery(element).animate({ 'line-height': '20px' },
                function() { done(); });
        }
    };
});*/
ttwr.filter('questionHasChoice', function() {
    return function(arr) {
        return arr.filter(function(value){
            return value.type!="Text";
        });
    };
});