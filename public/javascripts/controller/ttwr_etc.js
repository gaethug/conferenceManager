/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 13. 8. 22.
 * Time: 오후 2:38
 * To change this template use File | Settings | File Templates.
 */

ttwr.controller('EtcListCtrl',function($rootScope, $location, $http,$scope,$timeout, $dialog, socket){
    //Feedback({h2cPath:'/javascripts/html2canvas.js'});
    $scope.staticGoogleMap = "";
    $scope.myMarker = null;
    $scope.myLat = "";
    $scope.myLng = "";
    $scope.myAddress="";
    $scope.myMap = "";
    $scope.inputAddress="";
    $scope.mapOptions = {
        center: new google.maps.LatLng(37.562547290442424, 127.08589386940004),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //$scope.myMarker
    $scope.addMarker = function(latLng) {
        if($scope.myMarker == null){
            $scope.myMarker = new google.maps.Marker({
                map: $scope.myMap,
                position:latLng
            });
        }else{
            $scope.myMarker.setPosition(latLng);
        }
        $scope.myLat = latLng.nb||latLng.lb;
        $scope.myLng = latLng.ob||latLng.mb;
        var addr = new google.maps.Geocoder().geocode({location:latLng},function(result, status){
            console.log(result);
            $scope.myAddress=result[0].formatted_address;
        });
        addr;
        $scope.myMap.setCenter(latLng);
    };

    $scope.getMakerFromAddress = function(){
        if($scope.inputAddress != ""){
            var gio = new google.maps.Geocoder().geocode( { 'address': $scope.inputAddress}, function(results, status) {
                //console.log(results);
                //console.log(status);
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.addMarker(results[0].geometry.location);


                } else {
                    alert("주소가 이상함요.: " + status);
                }
            });
            gio;
        }
    };
    $scope.pictureSnapshot = function(){
        if($scope.myLat=="" || $scope.myLng ==""){
            $dialog.messageBox("Message", "지도에 마커를 찍어주세요.", [
                    {result: 'ok', label: 'Okay', cssClass: 'btn-primary'}])
                .open().then(function (result) {
                });
            return false;
        }

        $scope.staticGoogleMap =
            "http://maps.googleapis.com/maps/api/staticmap?center="
                +$scope.myLat+","+$scope.myLng
                +"&zoom="+$scope.myMap.zoom
                +"&size=500x400&sensor=false&markers=color:red%7Clabel:S%7C"+$scope.myLat+","+$scope.myLng;

        //프록시 사용
        /*html2canvas($('section'), {
         proxy: "/javascripts/server.js",    //https://github.com/BugHerd/html2canvas-proxy-node/blob/master/server.js
         useCORS: true,
         logging : true,
         //allowTaint:true,
         onrendered: function(canvas) {
         var img = canvas.toDataURL();
         window.open(img);
         }
         });*/
        /*$http({method: 'GET',transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
            url: url}).success(function(data){
                //console.log(data);
                //var img = $("img").attr("src", data);
                //$('body').appendTo(img);
                //console.log(data);
                $scope.staticGoogleMap = data;
            }).error(function(){
            });*/

    };

    socket.on('init', function (data) {
        current_username =  data.name;
        $scope.name = data.name;
        $scope.users = data.users;
    });

    socket.on('send:message', function (message) {
        var mention, me;
        mention = getMention(message.text);
        if(mention) {
            me = "active"
        } else {
            me = null;
        }
        $scope.messages.push({
            user: message.user,
            text: message.text,
            me: me
        });
        scrollDown();
    });

    socket.on('change:name', function (data) {
        changeName(data.oldName, data.newName);
        current_username = data.newName;
    });

    socket.on('user:join', function (data) {
        $scope.messages.push({
            user: 'chatroom',
            text: 'User ' + data.name + ' has joined.'
        });
        scrollDown();
        $scope.users.push(data.name);
    });

    // add a message to the conversation when a user disconnects or leaves the room
    socket.on('user:left', function (data) {
        $scope.messages.push({
            user: 'chatroom',
            text: 'User ' + data.name + ' has left.'
        });
        scrollDown();
        var i, user;
        for (i = 0; i < $scope.users.length; i++) {
            user = $scope.users[i];
            if (user === data.name) {
                $scope.users.splice(i, 1);
                break;
            }
        }
    });

    $(function(){
        $('#changeNameModal').modal('show')
    })

    // Private helpers
    // ===============

    var retrieveUsername = function() {
        var username;
        username = (localStorage.getItem("username") || false);
        if (!username) { return false; }
        return username;
    }


    var setup_member = function() {
        var username;
        username = retrieveUsername();
        console.log(username);
        if(username) {
            socket.emit('change:name', {
                name: username
            }, function (result) {
                if (!result) {
                    alert('There was an error changing your name');
                } else {

                    changeName($scope.name, username);

                    $scope.name = username;
                    $scope.newName = '';
                }
            });

            return;
        }
        return false;
    }

    // Check if message has a mention for current user
    var getMention = function(message) {
        var text,pattern,mention;
        text = message;
        pattern = /\B\@([\w\-]+)/gim;
        mention = text.match(pattern);

        if(mention){
            mention = String(mention).split("@")[1];
            if(mention === current_username) return mention;
        }

        return false;
    }

    var changeName = function (oldName, newName, member) {
        // rename user in list of users
        var i;
        for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i] === oldName) {
                $scope.users[i] = newName;
            }
        }

        localStorage.setItem("username",newName);
        current_username = newName;

        $scope.messages.push({
            user: 'chatroom',
            text: 'User ' + oldName + ' is now known as ' + newName + '.'
        });
        scrollDown();
    }

    // Methods published to the scope
    // ==============================

    $scope.mention = function (name) {
        $scope.message = '@' + name + ' ';
        $('.input-message').focus()
    };

    $scope.changeName = function () {
        socket.emit('change:name', {
            name: $scope.newName
        }, function (result) {
            if (!result) {
                alert('There was an error changing your name');
            } else {

                changeName($scope.name, $scope.newName);

                $scope.name = $scope.newName;
                $scope.newName = '';
                $('#changeNameModal').modal('hide')
            }
        });
    };

    $scope.messages = [];



    $scope.sendMessage = function () {
        socket.emit('send:message', {
            message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
            user: $scope.name,
            text: $scope.message
        });
        scrollDown();
        // clear message box
        $scope.message = '';
    };
    var scrollDown = function(){
        setTimeout(function(){
            var objDiv = angular.element(".chatView")[0];
            objDiv.scrollTop = objDiv.scrollHeight;//angular.element(".alert").height();
        },500);

    };
});
ttwr.controller('FormCreateCtrl',function($rootScope, $location, $http,$scope,$timeout, $dialog){
    $scope.newForm = {};
    $scope.myColName = "";
    $scope.forms = [];
    $scope.setType= function(type){
        $scope.newForm.Type = type;
        $scope.addForm();
    };
    $scope.addForm = function(){
        $scope.forms.push($scope.newForm);
        $scope.newForm = {};
    };
    $scope.addColumn = function(){
        if($scope.newForm.Cols== null){
            $scope.newForm.Cols = [];
        }
        $scope.newForm.Cols.push($scope.myColName);
        $scope.myColName = "";
    };
    $scope.createForm = function(){
        console.log($scope.forms);
    };
});
