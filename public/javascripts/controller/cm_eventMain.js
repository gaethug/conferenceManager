/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 4.
 * Time: 오후 1:09
 * To change this template use File | Settings | File Templates.
 */
cm.controller('eventMainCtrl',function($rootScope,$routeParams, $location, $http,$scope, eventREST){
    $scope.something = {};
    $scope.eventId = $routeParams.eventId;
    eventREST.get({id:$routeParams.eventId}, function(data){
        $scope.something = data.event;
    });
    $scope.deleteSomething = function(){
        eventREST.destroy({id:$routeParams.eventId},{},function(data){
            console.log(data);

        });
    };


    var people =function(human){
        var human = human;
        return {
            feature: function(question){
                return human.type=="sucker"?!question:question;
            },
            QnA: function(yesOrNo){
                return this.feature(yesOrNo);
            }
        }
    };
    var featureTypes = ["knight", "sucker"];
    var names = ["A","B", "C"];

    var combination = function(){
        //어림도 없는 컴비네이션
        var humanList = [];

        for(var i = 0 ; i < featureTypes.length ; i ++){
            var human = {};

            for(var j = 0 ; j < names.length ; j++){
                human.name = names[j];
                human.type=featureTypes[i];

                humanList.push(human);
                human = {};
            }
        }

        return humanList;
    };

    var A = {type:"sucker", name:"A"};
    var B = {type:"knight", name:"B"};
    people(A).QnA(A.type=="sucker")?"예":"아니오";
    people(B).QnA(B.type=="sucker")?"예":"아니오";

    function combinations(choices, callback, prefix) {
        if(!choices.length) {
            return callback(prefix);
        }
        for(var c = 0; c < choices[0].length; c++) {
            combinations(choices.slice(1), callback, (prefix || []).concat(choices[0][c]));
        }
    }

    combinations([featureTypes, names],function(message){
        if(typeof console == "object"){
            console.log(message);
        }
    });

    var humanGenerator = function(question){
        combination().forEach(function(human){
            var answer =  people(human).QnA(question)?"예":"아니오";
            console.log(human.name+"("+human.type+")"+" says "+answer);
        });
    };
    humanGenerator(true);



});