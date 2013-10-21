/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 8. 22.
 * Time: 오후 2:37
 * To change this template use File | Settings | File Templates.
 */

ttwr.controller('ListCtrl',function($rootScope, $location, $http,$scope,$timeout, $dialog){
    $scope.pageLimiter = 0;
    $scope.posts = [];
    $scope.catePosts = [];
    $scope.post = {};
    $scope.search = "";
    $scope.searchText = "";
    $scope.tagSearch = "";
    $scope.tagList = [];
    $scope.tabs = [];
    $scope.fakePost ={iamReady:"ready"};

    $scope.masonryElem ;


    $scope.today = function() {
        $scope.dt = new Date();
    };

    var extractTags = function(tag){
        //tag with 가중치
        /*var filterd = $scope.tagList.filter(function(f_tag){
            return f_tag.name==tag
        });
        console.log(filterd);
        if(filterd.length == 0){
            $scope.tagList.push({name:tag, rel:0});
        }else{
            angular.forEach(filterd, function(f_tag){f_tag.rel++;});
        }
        if($scope.tagList.length ==0){
            $scope.tagList.push({name:tag, rel:0});
        }*/
        if($scope.tagList.filter(function(f_tag){return f_tag==tag}).length == 0){
            $scope.tagList.push(tag);
        }
        if($scope.tagList.length ==0){
            $scope.tagList.push(tag);
        }
    };

    $scope.getClass = function(index){
        switch(index){
            case 0: return "panel-danger";
            case 1: return "panel-warning";
            case 2: return "panel-info";
            case 3: return "panel-success";
            case 4: return  "panel-default";
        }
    };
    var copyPaginList = function(fragedList){
        $scope.catePosts = angular.copy(fragedList);
    };

    //$scope.currentTab = "ALL";  //ALL, IT , MUSIC, ETC
    $scope.changeTab = function(tab){
        $scope.catePosts = [];
        angular.forEach($scope.tabs, function(tab){tab.disabled = false;});
        if(tab == "ALL"){
            $scope.tabs[0].active = true;
            copyPaginList($scope.posts);
        }else{
            copyPaginList($scope.posts.filter(function(post){return post.Category == tab; }));
        }
        $('body').animate({scrollTop: 0}, 500);
        //$scope.deletePinter();
        $scope.pageLimiter = 0;
        $scope.loadMore();
    };
    $scope.setTag = function(tag){
        //$scope.tabs[0].active = true;

        $scope.tagSearch = tag;
        for(var i = 0 ; i < $scope.posts.length; i++){
            $scope.posts[i].iamReady  = "none";
        }
        if(tag === ''){ //태그 삭제
            $scope.changeTab("ALL");
        }else{
            angular.forEach($scope.tabs, function(tab){tab.disabled = true; tab.active = false;});
            $scope.catePosts = [];
            var pushedList = [];
            angular.forEach($scope.posts, function(item){
                if(item.Tags.filter(function(itemTag){return tag.toLowerCase() === itemTag.toLowerCase();}).length > 0){
                    pushedList.push(item);
                }
            });
            copyPaginList(pushedList);
            $('body').animate({scrollTop: 0}, 500);
            $scope.pageLimiter = 0;
            $scope.loadMore();

        }

    };
    $scope.textSearch = function(text){
        $scope.searchText = text;
        $scope.search = '';
        if(text == "" || text == null){
            $scope.changeTab("ALL");
        }else{
            angular.forEach($scope.tabs, function(tab){tab.disabled = true; tab.active = false;});
            $scope.catePosts = [];
            var pushedList = [];
            angular.forEach($scope.posts, function(item){
                if(item.Contents.toLowerCase().indexOf(text.toLowerCase()) !== -1 || item.Title.toLowerCase().indexOf(text.toLowerCase()) !== -1){
                    pushedList.push(item);
                }
            });
            copyPaginList(pushedList);

            $('body').animate({scrollTop: 0}, 500);
            $scope.pageLimiter = 0;
            $scope.loadMore();
        }
    };
    var initTab = function(){
        $scope.tabs = [];
        $scope.tabs.push({ title:"전체",name:"ALL",disabled:true});
        angular.forEach($rootScope.PostTabs, function(postTab){
            var tab = {};
            tab.title = postTab.title;
            tab.name = postTab.name;
            tab.disabled = true;
            $scope.tabs.push(tab);
        });

        /*$scope.tabs = [
            { title:"전체",name:"ALL",disabled:true},
            { title:"IT/개발",name:"IT",disabled:true},
            { title:"음악",name:"MUSIC",disabled:true},
            { title:"기타",name:"ETC",disabled:true}
        ];*/
    };
    //$scope.cloudWidth = angular.element('.cloudBody').width();
    //$scope.words = ["Hallo","Test","Lorem","Ipsum","Lorem","ipsum","dolor","sit","amet,","consetetur","sadipscing","elitr,","sed","diam","nonumy","eirmod","tempor","invidunt","ut","labore","et","dolore","magna","aliquyam","erat,","sed","diam"];
    var getPostList = function(){
        $scope.posts  = [] ;
        initTab();
        //$scope.viewLoading = true;
        $rootScope.$broadcast('progress:spinStart');
        $http({method: 'GET', url: '/posts',headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                $scope.pageLimiter = 0;
                $scope.posts = data.posts;

                var listLength  = $scope.posts.length;
                angular.forEach($scope.tabs, function(tab, index){
                    if(tab.name == "ALL"){
                        tab.title = tab.title+" ("+listLength+")";
                    }else{
                        tab.title = tab.title+" ("+($scope.posts.filter(function(post){return post.Category==tab.name}).length)+")";
                    }
                    tab.disabled = false;
                });

                /*$scope.tabCount.ALL = listLength;
                $scope.tabCount.IT = $scope.posts.filter(function(post){return post.Category=="IT"}).length;
                $scope.tabCount.MUSIC = $scope.posts.filter(function(post){return post.Category=="MUSIC"}).length;
                $scope.tabCount.ETC = $scope.posts.filter(function(post){return post.Category=="ETC"}).length;*/


                setTimeout(function(){
                    for(var i = 0 ; i < listLength; i++){
                        for(var j = 0 ; j < $scope.posts[i].Tags.length ; j++){
                            extractTags($scope.posts[i].Tags[j]);
                        }
                    }
                },0);
                //$scope.catePosts = $scope.posts;
                copyPaginList($scope.posts);
                $rootScope.$broadcast('progress:spinStop');
                $scope.loadMore();

                angular.element('html').find('meta[name=description]').attr('content', "Post 목록");
                angular.element('html').find('meta[name=title]').attr('content', "TTWR PlayGround!!");
                angular.element('html').find('meta[name=url]').attr('content', 'http://ttwr-blog.herokuapp.com/postList');
                angular.element('html').find('meta[name=image]').attr('content', "http://ttwr-blog.herokuapp.com/images/icon100.png");

                //angular.element('.cloudBody').find('.tagItem a').tagcloud();

                /*angular.forEach($scope.posts, function (post) {
                    //post.AttachedImg = findImgTag(post.Contents);
                    var disjunctTag = stripTags(post.Contents, null);
                    post.Contents = disjunctTag.strip;
                    post.AttachedImg = disjunctTag.img;


                    angular.forEach(post.Tags, function (tag) {
                        extractTags(tag);
                    });

                });*/
                //$scope.changeTab("ALL");
                $scope.ready();
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
    };
    getPostList();
    //$scope.changeTab("ALL");
    $scope.goPost = function(postId){
        $location.path("/post/"+postId);
        //$location.path = "post/"+postId;
    };


    var stripTags = function  (post, allowed) {
        //if(post.Strip == null){
            var input = post.Contents;
            allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

            var stripTag = input.replace(/&nbsp;/g,'').replace(commentsAndPhpTags, '').replace(tags, function ($0, $1){return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';});
            var imgSrc = (input.match(/<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/)||"");
            if(imgSrc!= ""){
                imgSrc = imgSrc[1]+"?"+Math.random();
            }
            post.iamReady = "ready";
            post.Strip = true;
            post.Contents = stripTag.substr(0,150);
            post.AttachedImg = imgSrc;

        //}

    };

    $scope.loadMore = function() {
        /*for(var i = $scope.pageLimiter, length =  ($scope.pageLimiter + 6); i < length; i++){
            if(i > $scope.catePosts.length-1){
                break;
            }
            //$scope.catePosts[i].iamReady = "none";
            setTimeout(stripTags($scope.catePosts[i], null),0);
        }*/
        $scope.pageLimiter = ($scope.pageLimiter + 6);

    };
    $scope.showPopup = function(post){
        //$rootScope.User.displayName == null ||$rootScope.User.displayName == ""
        if($rootScope.User.displayName == null ||$rootScope.User.displayName == ""){
            $dialog.messageBox("Message", "페이지 하단 페이스북, 구글플러스 인증을 거치면 누구나 글을 쓸 수 있습니다. 롸잇 나우!", [
                    {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function (result) {
                });
        }else{
            $scope.post = post||{};
            $dialog.dialog({
                templateUrl:  '/fragments/post/createModal',
                controller: 'IdeaPostCtrl',
                resolve:{postId:function(){return null;}}
            }).open().then(function(result){
                    if(result=="SUCCESS"){
                        getPostList();
                    }else{

                    }
                });
        }
    };
    /*$timeout(function(){$scope.toggleMenu();},2000);
    $scope.toggleMenu = function(){
        if(angular.element('.postFloatMenu').css('translate') == 0){
            angular.element('.postFloatMenu').transition({x:'-100px'});
            return false;
        }
        if(angular.element('.postFloatMenu').css('translate')== 0? -1 : angular.element('.postFloatMenu').css('translate').indexOf('-100px') == 0){
            angular.element('.postFloatMenu').transition({x:'0px'});
        }else{
            angular.element('.postFloatMenu').transition({x:'-100px'});
        }
    };*/
    $scope.showTagPopup = function(){
        $dialog.dialog({
            templateUrl:  '/fragments/post/tagListModal',
            controller: 'TagListCtrl',
            resolve:{tagList:function(){return $scope.tagList}}
        }).open().then(function(result){
                if(result != "FAIL"){
                    $scope.setTag(result);
                }
            });
    };
    $scope.showAnimate = function(event, index){
        /*if(ready == null || ready == false){
            return false;
        }*/
        if(event.type==="mouseenter"){
            if(index%2 == 0){
                $(event.currentTarget).transition({ skewX: '1deg' }).transition({ skewX: '0deg' });
            }else{
                $(event.currentTarget).transition({ skewX: '-1deg' }).transition({ skewX: '0deg' });
            }
        }
    };

});
ttwr.controller('PostCtrl',function($rootScope,$location, $http,$scope,$routeParams, $dialog, $sce, $timeout){
    $scope.postId = $routeParams.id;    //getMain후 post._id를 쓰면 신사적이겠지만 페이스북 좋아요 버튼이 기다려 주지 않는다.
    $scope.post = {};
    $scope.newComment = "";
    $scope.writerDetail = [];
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
    var iambusy = false;
    for(var i = 0 ; i < 2; i++){
        $scope.writerDetail[i]= {};
        $scope.writerDetail[i].displayName = "";
        $scope.writerDetail[i].profileUrl = "";
        $scope.writerDetail[i].picture = "";
    }
    var getMain = function(){
        $rootScope.$broadcast('progress:spinStart');
        $http({method: 'GET', url: '/posts/'+$routeParams.id,headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                if(data.post == null){
                    $location.path('/');
                }

                $scope.post = data.post;

                //youtube 이미지를 youtube 동영상으로 파싱하기 위해 html로 변경해서 파싱 후 다시 text로 돌리는 미친짓을.... 음...정규식으로 다 처리하기에는 ...
                var element = $('<div>').html(data.post.Contents);
                var shareDescription = $(element).find("p").text().substring(0,100)+"...";
                var primaryImg = "";
                angular.forEach(element.find("img"), function(youtube, index){
                    if(index==0){
                        primaryImg = youtube.src;
                    }
                    if(youtube.alt === "youtube"){
                        var youtubeId =$(youtube).attr('name');
                        $(youtube).replaceWith('<iframe width=\"400\" height=\"225\" src=\"http://www.youtube.com/embed/'+ youtubeId + '\" frameborder=\"0\"></iframe>');
                    }
                });
                angular.forEach(element.find("div[class=IamMusicMan]"), function(musicLinkElm){
                    var musicLink =$(musicLinkElm).text();
                    $(musicLinkElm).replaceWith('<audio controls="controls" id="AudioPlayerInPost"><source src="'+musicLink+'"></audio>');
                    angular.element("#AudioPlayerInPost").load();
                });
                $scope.post.Contents = $sce.trustAsHtml($(element).html());

                $scope.post.Comments.reverse();
                $scope.post.CategoryValue = $rootScope.PostTabs.filter(function(tab){return tab.name == $scope.post.Category;})[0].title;//categoryValue[$scope.post.Category];
                $rootScope.$broadcast('progress:spinStop');
                angular.element('html').find('meta[name=description]').attr('content', shareDescription);
                angular.element('html').find('meta[name=title]').attr('content', $scope.post.Title);
                angular.element('html').find('meta[name=url]').attr('content', 'http://ttwr-blog.herokuapp.com/post/'+$scope.postId);
                angular.element('html').find('meta[name=image]').attr('content', primaryImg||"http://ttwr-blog.herokuapp.com/images/icon100.png");
                //angular.element('html').find('link[rel=image_src]').attr('href', primaryImg||"http://ttwr-blog.herokuapp.com/images/icon100.png");
                $scope.ready();
                //setWriterInfo();
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
    };
    getMain();

    var setWriterInfo = function(){
        var getFacebookInfo = function(writer, writerId){
            $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
                url: "https://graph.facebook.com/"+writerId+"?fields=picture"}).success(function(data){
                    //data.picture.data.url;
                    writer.displayName = data.name;
                    writer.profileUrl = data.link;
                    writer.picture = data.picture.data.url;
                });
        }

        getFacebookInfo($scope.writerDetail[0],$scope.post.FirstWriter.id);
        //getFacebookInfo($scope.writerDetail[1],$scope.post.LastWriter.id);
    };
    $scope.showFacebookShare = function(){
        /*FB.ui(
            {
                method: 'share',
                name: 'This is the content of the "name" field.',
                link: 'http://localhost:3030/post/'+$scope.postId,
                picture: 'http://ttwr-blog.herokuapp.com/images/icon100.png',
                caption: 'This is the content of the "caption" field.',
                description: 'This is the content of the "description" field, below the caption.',
                message: ''
            }
        );*/

        var url =
        'http://www.facebook.com/sharer.php?s=100&'
            + '&p[title]='
            +encodeURIComponent('TTWR PlayGround')
            + '&p[summary]='
            +encodeURIComponent($scope.post.Title)
            + '&p[url]='
            + encodeURIComponent('http://ttwr-blog.herokuapp.com/post/'+$scope.postId)
            + '&p[images][0]='
            + encodeURIComponent('http://ttwr-blog.herokuapp.com/images/icon100.png');
        window.open(
            url,
            'facebook-share-dialog',
            'width=626,height=436');
        return false;
    };
    $scope.showGoogleShare = function(){
        var url = 'http://ttwr-blog.herokuapp.com/post/'+$scope.postId;
        window.open(
            'https://plus.google.com/share?url='+url,'',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        return false;
    };
    $scope.showPopup = function(post){
        $scope.post = post||{};
        $dialog.dialog({
            templateUrl:  '/fragments/post/createModal',
            controller: 'IdeaPostCtrl',
            resolve:{postId:function(){return $scope.post._id}}
        }).open().then(function(result){
                if(result=="SUCCESS"){
                    getMain();
                }else{

                }
            });
    };

    $scope.writeComment = function(){
        //console.log($scope.newComment);
        if($rootScope.User.displayName == null ||$rootScope.User.displayName == "" ){
            $dialog.messageBox("Message", "페이지 하단 페이스북, 구글플러스 인증을 거치면 댓글을 남길 수 있습니다. 롸잇 나우!", [
                    {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function (result) {
                });
            return false;
        }
        if($scope.newComment==""||$scope.newComment==null){
            return false;
        }
        $rootScope.$broadcast('progress:spinStart');
        if(!iambusy){
            iambusy = true;
            $http({
                url:'/posts/'+$scope.post._id+"/comment"
                ,method:"PUT"
                ,data: $.param({"Text":$scope.newComment})
                ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data){
                    console.log(data);
                    iambusy = false;
                    $rootScope.$broadcast('progress:spinStop');
                    if(data.result==="OK"){
                        $scope.newComment = "";
                        getMain();
                    }else{
                        $dialog.messageBox("Message", "댓글 쓰기 실패. 로그인이 풀렸어요.", [
                                {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                            .open().then(function (result) {
                                $rootScope.$broadcast('loginRequired');
                            });
                    }
                });
        }
    };
    $scope.deleteComment = function(commentId){
        if(!iambusy){
            iambusy = true;
            $rootScope.$broadcast('progress:spinStart');
            $http({
                url:'/posts/'+$scope.post._id+'/comment/'+commentId
                ,method:"DELETE"
                ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data){
                    console.log(data);
                    iambusy = false;
                    $rootScope.$broadcast('progress:spinStop');
                    if(data.result==="OK"){
                        getMain();
                    }else{
                        $dialog.messageBox("Message", "댓글 삭제 실패. 로그인이 풀렸어요.", [
                                {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                            .open().then(function (result) {
                                $rootScope.$broadcast('loginRequired');
                            });
                    }
                });
        }
    };
});
ttwr.controller('TagListCtrl',function($scope,$timeout, $http, $filter,$rootScope,  dialog, tagList){
    $scope.tagList = tagList;
    $scope.setTag = function(tag){dialog.close(tag);};
    $scope.close = function(){dialog.close("FAIL");};
});
ttwr.controller('IdeaPostCtrl',function($scope,$timeout, $http, $filter,$rootScope, $location,  dialog, postId, $dialog){
    var iamBusy = false;
    $scope.tinymceOptions = {
        convert_urls: false,
        menubar:false,
        plugins: "advlist, autolink, lists, link, code, table, image",
        toolbar: 'styleselect | removeformat | hr link | bullist numlist | table | code | image',
        content_css: 'http://ttwr-blog.herokuapp.com/stylesheets/style.css'
    };
    /*plugins: "autolink, link, code",
        toolbar: 'styleselect | removeformat | hr link | bullist numlist |  | code'*/
    /*plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
    ],
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image | fontselect fontsizeselect | forecolor backcolor",
        convert_urls: false,
        content_css: 'http://www.mydomain.com/css/fonts.css'*/
    //outdent indent 는 서버의 xss방어에 의해 처참히 짤려나
    /*convert_urls: false
        ,menubar:false,
        plugins: "table, code, link, visualblocks",
        tools: "inserttable",
        font_size_style_values: "8px,14px,18px,20px, 28px",
        valid_elements : "a[href|target=_blank],strong/b,div[align],br",
        toolbar: 'styleselect | removeformat | hr link | forecolor backcolor | outdent indent | fontsizeselect | code'*/
    //content_css: 'http://www.ttwr-blog.herokuapp.com/stylesheet/bootstrap.min.css'
    /*
     plugins: "table, code, link",
     tools: "inserttable",
     toolbar: 'undo redo | styleselect | removeformat | hr link | bullist numlist | outdent indent | table | code',

    * */
    $scope.post = {};
    $scope.Tag = "";

    if(postId == null||postId==""){
        $scope.mode = "create";
        $scope.post.Contents = "<p></p>";
        $scope.post.Category = "ETC";
        $scope.post.Rating = 5;
    }else{
        /*$scope.post._id = post._id;
        $scope.post.Title = post.Title;
        $scope.post.Contents = post.Contents;
        $scope.post.Tags = post.Tags;*/
        $scope.mode = "edit";

        $http({method: 'GET', url: '/posts/'+postId, headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                $scope.post = data.post;
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    }
    $scope.updatePost = function(){
        $rootScope.$broadcast('progress:spinStart');
        $http({
            url:'/posts/'+$scope.post._id
            ,method:"PUT"
            ,data: $.param({"Title":$scope.post.Title, "Contents":$scope.post.Contents, Rating:$scope.post.Rating,
                "Category":$scope.post.Category,"Tags":$scope.post.Tags||[]})
            ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
                //console.log(data);
                $rootScope.$broadcast('progress:spinStop');
                //getEssayList();
                //$scope.essays.unshift(data.essay);
                //dialog.close("SUCCESS");
                if(data.result==="OK"){
                    dialog.close("SUCCESS");
                }else{
                    $dialog.messageBox("Message", "수정 실패. 로그인이 풀렸어요.", [
                            {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                        .open().then(function (result) {
                            $rootScope.$broadcast('loginRequired');
                        });
                }
            });
    };
    $scope.createPost = function(){
        if(!iamBusy){
            iamBusy = true;
            $rootScope.$broadcast('progress:spinStart');
            $http({
                url:'/posts/create'
                ,method:"POST"
                ,data: $.param({"Title":$scope.post.Title, "Contents":$scope.post.Contents, "Category":$scope.post.Category,Rating:$scope.post.Rating, "Tags":$scope.post.Tags||[]})
                ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data){
                    console.log(data);
                    iamBusy = false;
                    $rootScope.$broadcast('progress:spinStop');
                    //getEssayList();
                    //$scope.essays.unshift(data.essay);
                    if(data.result==="OK"){
                        dialog.close("SUCCESS");
                    }else{

                        $dialog.messageBox("Message", "글쓰기 실패. 로그인이 풀렸어요.", [
                                {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}
                            ])
                            .open().then(function (result) {
                                $rootScope.$broadcast('loginRequired');
                            });
                    }
                });
        }

    };
    $scope.deletePost = function(){
        $rootScope.$broadcast('progress:spinStart');
        $http({
            url:'/posts/'+$scope.post._id
            ,method:"DELETE"
            ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
                console.log(data);
                $rootScope.$broadcast('progress:spinStop');
                if(data.result==="OK"){
                    dialog.close();
                    $location.path("/");
                }else{
                    $dialog.messageBox("Message", "삭제 실패. 로그인이 풀렸어요.", [
                            {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}
                        ])
                        .open().then(function (result) {
                            $rootScope.$broadcast('loginRequired');
                        });
                }
            });
    };
    $scope.addTag = function(){
        if($scope.post.Tags == null){
            $scope.post.Tags = [];
        }
        if($scope.Tag.length > 0){
            var slitedTag = $scope.Tag.split(",");
            if(slitedTag.length>1){
                angular.forEach(slitedTag, function(tag){
                    $scope.post.Tags.push(tag.trim());
                    //console.log(tag);
                });
                //$scope.Tag = "";
            }else{
                $scope.post.Tags.push(slitedTag[0].trim());
                //$scope.Tag = "";
            }
        }
        $scope.Tag = "";
    };
    $scope.removeTag = function(index){
        $scope.post.Tags.splice(index,1);
    };
    $scope.close = function(){dialog.close("FAIL");};

    $scope.$watch('uploadFileCallback',function(){
        if(!!$scope.uploadFileCallback){
            //console.log();
            if($scope.uploadFileCallback.result==null){
                return false;
            }
            if($scope.uploadFileCallback.result=="FAIL"){
                $dialog.messageBox("알림", "파일에 문제가 있습니다.", [{result: 'ok', label: '확인', cssClass: 'btn-primary'}])
                    .open().then(function (result) {});
                return false;
            }
            $scope.post.Contents += '<p><img width="350" src="'+$scope.uploadFileCallback.uploadPath.replace("./public","")+'"></p>';

        }
    });

    $scope.showAttachYoutubePopup = function(){
        $dialog.dialog({
            templateUrl:  '/fragments/common/youtubeInsertModal',
            controller: 'YoutubeInsertCtrl'
        }).open().then(function(result){
                if(result!="FAIL"){
                    $scope.post.Contents += '<p><img width="350" alt="youtube" name="'+result+'" src="http://img.youtube.com/vi/'+result+'/1.jpg"></p>';
                }
            });
    };
    $scope.showAttachMusicLinkPopup = function(){
        $dialog.dialog({
            templateUrl:  '/fragments/common/musicLinkInsertModal',
            controller: 'MusicLinkInsertCtrl'
        }).open().then(function(result){
                if(result!="FAIL"){
                    $scope.post.Contents += '<p><div class="IamMusicMan">'+result+'</div></p>';
                }
            });
    };
});