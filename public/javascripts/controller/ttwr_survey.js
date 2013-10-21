/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 8. 22.
 * Time: 오후 2:38
 * To change this template use File | Settings | File Templates.
 */
ttwr.controller('SurveyListCtrl',function($rootScope, $location, $http,$scope,$timeout, $dialog){
    $scope.pageLimiter = 0;
    $scope.surveys = [];
    $scope.survey = {};
    $scope.search = "";
    $scope.tagList = [];


    var getSurveyList = function(){
        $scope.surveys.length  = 0 ;
        $http({method: 'GET', url: '/surveys',headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                $scope.surveys = data.surveys;
                $scope.ready();
                angular.element('html').find('meta[name=description]').attr('content', "설문 목록");
                angular.element('html').find('meta[name=title]').attr('content', "TTWR PlayGround!!");
                angular.element('html').find('meta[name=url]').attr('content', 'http://ttwr-blog.herokuapp.com/surveyList');
                angular.element('html').find('meta[name=image]').attr('content', "http://ttwr-blog.herokuapp.com/images/icon100.png");

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);
            });
    };
    getSurveyList();

    $scope.goSurvey = function(surveyId){
        $location.path("/survey/"+surveyId);
    };

    $scope.setTag = function(tag){
        $scope.search = tag;
    };
    $scope.loadMore = function() {
        $scope.pageLimiter = $scope.pageLimiter + 4;
    };

    $scope.loadMore();

    $scope.showResultPopup =function(survey){
        if(survey.FirstWriter.name =="UNKNOWN" || ($rootScope.User.id ==  survey.FirstWriter.id)){
            $dialog.dialog({
                templateUrl:  '/fragments/survey/resultModal',
                controller: 'SurveyResultCtrl',
                resolve:{surveyId:function(){return survey._id}}
            }).open().then(function(result){
                    if(result=="SUCCESS"){
                    }else{

                    }
                });
        }else{
            $dialog.messageBox("Message", "본인의 설문지만 결과를 확인할 수 있습니다. 단, 페이스북 인증을 거치지 않고 생성된 설문은 누구나 결과를 확인할 수 있습니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function(result){
                    if(result=='ok'){
                    }
                });
        }

    };
});
ttwr.controller('SurveyCtrl',function($rootScope, $location, $http, $scope, $routeParams, $dialog){
    $scope.surveyId = $routeParams.id;
    $scope.survey = {};
    $scope.triggerTargets = [];
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
    var getMain = function(){
        $http({method: 'GET', url: '/surveys/'+$scope.surveyId, headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);

                if(data.survey == null){
                    $location.path('/');
                }
                //
                $scope.responses= [];
                for(var i =0; i < data.survey.Questions.length; i++){
                    if(data.survey.Questions[i].type==="CheckBox"){
                        $scope.responses.push(
                            {
                                questionId: data.survey.Questions[i].questionId,
                                answer : []
                            }
                        );
                    }else{
                        $scope.responses.push(
                            {
                                questionId: data.survey.Questions[i].questionId,
                                answer : ""
                            }
                        );
                    }
                    if(data.survey.Questions[i].options.targetId == ""){
                        data.survey.Questions[i].disabled = false;
                    }else{

                        var options = data.survey.Questions[i].options;
                        data.survey.Questions[i].options.targetQnum = data.survey.Questions.filter(function(question){return question.questionId == options.targetId;})[0].qNum;
                        options.questionId = data.survey.Questions[i].questionId;
                        $scope.triggerTargets.push(options);
                        data.survey.Questions[i].disabled = true;
                    }
                }
                $scope.survey = data.survey;
                angular.element('html').find('meta[name=description]').attr('content', $scope.survey.Memo);
                angular.element('html').find('meta[name=title]').attr('content', $scope.survey.Title);
                angular.element('html').find('meta[name=url]').attr('content', 'http://ttwr-blog.herokuapp.com/post/'+$scope.surveyId);
                angular.element('html').find('meta[name=image]').attr('content', "http://ttwr-blog.herokuapp.com/images/icon100.png");

                $scope.ready();
            });
    };
    getMain();
    $scope.$watch('responses', function (responses) {
        //var taegetQuestion = $scope.survey.Questions.filter(function(question){return question.questionId == targetResponse[0].questionId;});

        for(var i=0, len = $scope.triggerTargets.length; i < len; i++){
            var targetResponse = responses.filter(function(response){return response.questionId === $scope.triggerTargets[i].targetId;});   //타켓의 응답
            //console.log(targetResponse);
            if(targetResponse){

                var triggedQuestion = $scope.survey.Questions.filter(function(question){return question.questionId == $scope.triggerTargets[i].questionId;}); //enabled disabled 되어야 할 퀘스쳔
                var trggedResponse = responses.filter(function(response){return response.questionId === $scope.triggerTargets[i].questionId;});
                //console.log("TriggedQuestion:"+triggedQuestion[0].title);
                //if(targetResponse[0].answer == $scope.triggerTargets[i].targetChoice){
                var isSame = false;

                //응답된 타겟의 앤스워 가 같으냐 다르냐
                if(angular.isArray(targetResponse[0].answer)){
                    isSame = targetResponse[0].answer.filter(function(answer){return answer == $scope.triggerTargets[i].targetChoice}).length>0?true:false;
                }else{
                    isSame =  targetResponse[0].answer == $scope.triggerTargets[i].targetChoice ?true:false;
                }
                if(isSame){
                    //console.log("Trigger On");
                    triggedQuestion[0].disabled = false;
                }else{
                    //console.log("not Trigged");
                    triggedQuestion[0].disabled = true;
                    trggedResponse[0].answer ="";
                }
            }
        }
    }, true);
    $scope.ngObjFixHack = function(ngObj) {
        var output;

        output = angular.toJson(ngObj);
        output = angular.fromJson(output);

        return output;
    }
    $scope.showFacebookShare = function(){
        var title = "[설문조사]"+$scope.survey.Title;
        //var summary = $scope.survey.Memo;
        var img = "http://ttwr-blog.herokuapp.com/images/icon.png";
        //var img = stripTags($scope.post,null).Img;
        var url = 'http://ttwr-blog.herokuapp.com/survey/'+$scope.surveyId;
        window.open(
            //'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://ttwr-blog.herokuapp.com/post/'+$scope.postId), &p[images][0]=
            'https://www.facebook.com/sharer/sharer.php?s=100&p[title]=TTWR PlayGround&p[summary]='+title+'&p[url]='+url+'&p[images][0]='+encodeURIComponent(img),
            'facebook-share-dialog',
            'width=626,height=436');
        return false;
    };
    $scope.showGoogleShare = function(){
        var url = 'http://ttwr-blog.herokuapp.com/survey/'+$scope.surveyId;
        window.open(
            'https://plus.google.com/share?url='+url,'',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        return false;
    };
    $scope.responseSurvey = function(){

        //question이 enable인데 answer가 ""인 사람은 혼나야함
        var unAnswerdQuestionNumber = 0;
        for(var i = 0 , len = $scope.survey.Questions.length; i < len ; i++){
            if($scope.survey.Questions[i].disabled == false ){  //즉 응답이 있어야 하는데 없는 경우
                //$scope.survey.Questions[i]
                var answer = $scope.responses.filter(function(res){return res.questionId == $scope.survey.Questions[i].questionId})[0].answer;
                if(angular.isArray(answer)){
                    //다중 택 checkbox
                    if(answer.filter(function(answer){return answer.length > 0}).length==0){
                        //응답 안됨
                        unAnswerdQuestionNumber = $scope.survey.Questions[i].qNum;
                        break;
                    }
                }else{
                    if(answer == "" || answer == null){
                        unAnswerdQuestionNumber = $scope.survey.Questions[i].qNum;
                        break;
                    }
                }
            }
        }

        if(unAnswerdQuestionNumber > 0){ //0보다 크거나로 하고 싶으나 이전에 생성된 설문지는 qNum이 없으니까..
            //alert(unAnswerdQuestionNumber+"번 응답이 누락 되었습니다. 활성화 된 질문에 모두 응답해 주셔야 합니다.");


            $dialog.messageBox("Message", unAnswerdQuestionNumber+"번 응답이 누락 되었습니다. 활성화 된 질문에 모두 응답해 주셔야 합니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function(result){
                    //$location.path("/surveyList");
                });
            return false;
        }else{
            $http({
                url:'/responses/create'
                ,method:"POST"
                ,data: $.param({"surveyId":$scope.survey._id, "Responses":$scope.ngObjFixHack($scope.responses)})
                ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function(data){
                    console.log(data);
                    if(data.result==="OK"){
                        //alert("설문에 답변해 주셔서 감사합니다.");
                        //$location.path("/surveyList");
                        $dialog.messageBox("Message", "설문에 답변해 주셔서 감사합니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                            .open().then(function(result){

                                $location.path("/surveyList");
                            });
                    }
                });
        }
        /*$http({
            url:'/responses/create'
            ,method:"POST"
            ,data: $.param({"surveyId":$scope.survey._id, "Responses":$scope.ngObjFixHack($scope.responses)})
            ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
                console.log(data);
                if(data.result==="OK"){
                    $dialog.messageBox("Message", "설문에 답변해 주셔서 감사합니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                        .open().then(function(result){
                            $location.path("/surveyList");
                        });
                }
            });*/

    };
});
ttwr.controller('SurveyCreateCtrl',function($rootScope,$location, $http,$scope,$routeParams, $dialog){
    $scope.questionList = [];
    var point3Selects = ["아니다.","보통이다.","그렇다."];
    var point5Selects = ["전혀 아니다.","아니다.","보통이다.","그렇다.","매우 그렇다."];
    $scope.surveyTitle = "";
    $scope.surveyMemo = "";
    $scope.preQuestion = {};
    $scope.showTrigger = false;
    $scope.preOption = {
        question:{},choice:""
    };
    var resetPreQuestion = function(){
        $scope.preQuestion = {
            choices :[],
            title :"",
            options:{targetId:"",targetTitle:"",targetChoice:""}
        };
        $scope.showTrigger = false;
    };
    $scope.questionTypes = [
        {name:'3점 척도', value:'3point'},
        {name:'5점 척도', value:'5point'},
        {name:'주관식', value:'Text'},
        {name:'객관식 택 1', value:'Radio'},
        {name:'객관식 택 다수', value:'CheckBox'}
    ];
    resetPreQuestion();
    $scope.addChoice = function(choice){
        if(choice=="" || choice == null || $scope.preQuestion.choices.filter(function(value){return value==choice}).length > 0 ){
            $scope.preChoice = "";
            return false;
        }
        $scope.preQuestion.choices.push(choice);
        $scope.preChoice = "";
    };
    $scope.deleteChoice = function(index){
        $scope.preQuestion.choices.splice(index,1);
    };
    $scope.copyQuestion = function(index){
        $scope.preQuestion = angular.copy($scope.questionList[index]);
        $scope.preQuestion.questionId = null;
    };
    $scope.deleteQuestion = function(index){
        $scope.questionList.splice(index,1);
        $scope.enterQuestionNumber();
    };
    $scope.addQuestion = function(){
        if($scope.preQuestion.title==""){
            $dialog.messageBox("Message", "질문 제목이 누락 되었습니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function(result){
                    if(result=='ok'){
                    }
                });
            return false;
        }
        if($scope.preQuestion.type=="Radio" || $scope.preQuestion.type=="CheckBox"){
            if($scope.preQuestion.choices.length < 2){
                $dialog.messageBox("Message", "선택지는 두 개 이상이어야 해요.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                    .open().then(function(result){
                        if(result=='ok'){
                        }
                    });
                return false;
            }
        }
        if($scope.preQuestion.type==="3point"){
            $scope.preQuestion.choices = point3Selects;
        }
        if($scope.preQuestion.type==="5point"){
            $scope.preQuestion.choices = point5Selects;
        }
        $scope.preQuestion["questionId"] = new Date().getTime();
        $scope.questionList.push($scope.preQuestion);
        resetPreQuestion();
        $scope.enterQuestionNumber();
    };
    $scope.addQuestionTrigger = function(){
        if($scope.preOption.question.questionId == null || $scope.preOption.choice == ""){
            $dialog.messageBox("Message", "올바른 트리거를 선택해 주세요.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function(result){
                    if(result=='ok'){
                    }
                });
            return false;
        }
        $scope.preQuestion.options={
            targetId:$scope.preOption.question.questionId,
            targetTitle:$scope.preOption.question.title,
            targetChoice:$scope.preOption.choice
        };
        $scope.preOption = {
            question:{},choice:""
        };
        $scope.showTrigger = false;
    };
    $scope.deleteQuestionTrigger = function(){
        $scope.preQuestion.options={targetId:"",targetTitle:"",targetChoice:""};
        $scope.preOption = {
            question:{},choice:""
        };
        $scope.showTrigger = false;
    };
    $scope.ngObjFixHack = function(ngObj) {
        var output;

        output = angular.toJson(ngObj);
        output = angular.fromJson(output);

        return output;
    }
    $scope.createSurvey = function(){
        if($scope.surveyTitle==""){
            $dialog.messageBox("Message", "설문 제목이 누락 되었습니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function(result){
                    if(result=='ok'){
                    }
                });
            return false;
        }

        $http({
            url:'/surveys/create'
            ,method:"POST"
            ,data: $.param({"Title":$scope.surveyTitle, "Memo":$scope.surveyMemo,"Questions":$scope.ngObjFixHack($scope.questionList)})
            ,headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data){
                console.log(data);
                if(data.result==="OK"){
                    $dialog.messageBox("Message", "설문이 생성 되었습니다.", [{result:'ok', label: 'Okay', cssClass: 'btn-primary'}])
                        .open().then(function(result){
                            if(result=='ok'){
                                $location.path("/surveyList");
                            }
                        });
                }
            });
    };

    $scope.enterQuestionNumber = function(){
        for(var i=0, len = $scope.questionList.length; i < len; i++){
            $scope.questionList[i].qNum = i+1;
        }
    };
});

ttwr.controller('SurveyResultCtrl',function($rootScope, $location, $http, $scope, dialog,  surveyId, $dialog){
    $scope.survey = {};
    var palettes = [
        "#c64537","#dd8338", "#308cbc", "#82c833" ,"#455860"
    ];
    $scope.chartOptions = {
        segementStrokeWidth: 20,
        segmentStrokeColor: '#000'
    };

    var getMain = function(){
        $http({method: 'GET', url: '/surveys/'+surveyId+"/result",headers:  { 'If-Modified-Since': "0" }}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                $scope.survey = data.survey;
                var result = [];
                angular.forEach($scope.survey.Questions, function(question, qIndex){
                    var questionResult = {
                        options : question.options,
                        qNum :question.qNum,
                        title : question.title,
                        type:question.type,
                        choices:[],
                        chart:{
                            labels:[],
                            datasets:[
                                {
                                    fillColor : palettes[qIndex%palettes.length],
                                    strokeColor : palettes[qIndex%palettes.length],
                                    pointColor : "rgba(132,144,148,1)",
                                    pointStrokeColor : "#ecefed",
                                    data:[]
                                }
                            ]
                        },
                        chartOptions :{
                        }
                    };
                    if(question.choices == null){   //type : TEXT
                        for(var i = 0 ; i <$scope.survey.Responses.length; i++) {
                            var choice = {
                                text : "",
                                count:0,
                                taker:[]
                            };
                            if($scope.survey.Responses[i].Answers[qIndex].answer != "" && $scope.survey.Responses[i].Answers[qIndex].answer != null){
                                choice.count ++;
                                choice.taker.push($scope.survey.Responses[i].Writer);
                                choice.text = $scope.survey.Responses[i].Answers[qIndex].answer;
                                questionResult.choices.push(choice);

                            }
                        }

                    }else{
                        //2개의 선택지 질문에는 다음 옵션을 건다.
                        if(question.choices.length == 2){
                            questionResult.chartOptions ={
                                scaleOverlay: true,
                                scaleOverride : true,
                                scaleSteps :$scope.survey.Responses.length,
                                scaleStepWidth : 1
                            }
                        }
                        for(var j = 0; j < question.choices.length ; j++){
                            var choice = {
                                text : question.choices[j],
                                count:0,
                                taker:[]
                            };

                            for(var i = 0 ; i <$scope.survey.Responses.length; i++) {
                                if(typeof $scope.survey.Responses[i].Answers[qIndex].answer === "object"){  // 다중 객관식 CheckBox
                                    if($scope.survey.Responses[i].Answers[qIndex].answer.filter(function(answer){return answer === question.choices[j]}).length > 0){
                                        choice.count ++;
                                        choice.taker.push($scope.survey.Responses[i].Writer);
                                    }
                                }else{
                                    if(question.choices[j]===$scope.survey.Responses[i].Answers[qIndex].answer){
                                        choice.count ++;
                                        choice.taker.push($scope.survey.Responses[i].Writer);
                                    }
                                }

                            }
                            //questionResult.chart.labels.push(question.choices[j]);
                            questionResult.chart.labels.push("보기 "+(j+1)+"번");
                            questionResult.chart.datasets[0].data.push(choice.count);
                            questionResult.choices.push(choice);
                        }
                    }
                    result.push(questionResult);
                });
                console.log(result);
                $scope.survey.Result = result;


            });
    };
    getMain();

    $scope.showTaker = function(taker){
        $dialog.dialog({
            templateUrl:  '/fragments/survey/resultTakerModal',
            controller: 'SurveyResultTakerCtrl',
            resolve:{taker:function(){return taker}}
        }).open().then(function(result){
            });
    };
    $scope.close = function(){
        dialog.close();
    };
});
ttwr.controller('SurveyResultTakerCtrl',function($scope,$http, dialog, taker){
    $scope.takers = taker;
    angular.forEach($scope.takers, function(taker){
        if(taker.id != "UNKNOWN"){
            $http({method: 'GET',headers:  { 'If-Modified-Since': "0" },
                url: "https://graph.facebook.com/"+taker.id+"?fields=picture"}).success(function(data){
                    taker.picture = data.picture.data.url;
                });
        }else{
            taker.picture = "/images/fuckfuck (1).png";
        }

    });

    $scope.close = function(){
        dialog.close();
    };
});