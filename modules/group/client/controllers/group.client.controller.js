'use strict';

angular.module('group').controller('GroupController', ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService',
    function GroupController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.groupId = $stateParams.id;
        vm.assignments = [];
        vm.title = '';
        vm.stream = {};
        groupService.get({id: vm.groupId}, function (res){
          if (res.status == 'success') {
              vm.groupInfo = res.data;
          }
        })
        vm.count = function() {
            groupService.count({id: vm.groupId}, function (res){
                if (res.status == 'success') {
                    vm.count = res.data;
                }
            })
        }
        groupService.checkJoined({id: vm.groupId, uid: vm.auth.user._id}, function (res) {
            if(res.status != 'success' && vm.groupInfo.createdBy != vm.auth.user_id) {
                $state.go('group-info', {id: vm.groupId});
            }
        }, function (err) {
            console.log(err);
        })
        vm.count();
        vm.getUserAnswer = function (assignment) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'view-assignment.html',
                controller: 'ViewAnswerController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'ViewAnswerController',
                resolve: {
                    data: assignment
                }
            });
        }
        vm.getStream = function() {

            groupService.getStream({id: vm.groupId},function (res) {
                if (res.status == 'success') {
                    vm.stream =res.data;
                }
            }, function (fail) {
                console.log(fail)
            })
        }
        vm.getStream();
        groupService.getActiveAssignment({id: vm.groupId}, function(res) {
            if(res.status == 'success') {
                vm.assignments = res.data;
                if (vm.assignments.length > 0) {
                    vm.assignments.forEach(function (assignment){
                        groupService.getStudentAnswers({aid: assignment._id, uid: vm.auth.user._id}, {}, function(res) {
                            if (res.status == 'success') {
                                assignment.answer = res.data;
                            }
                        });
                    })
                }
            }
        }, function (fail) {
            toastr.warning('Lỗi khi lấy bài khảo sát');
            console.log(fail);
        });
        vm.openStream = function() {
            vm.getStream();
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'stream-modal.html',
                controller: 'StreamController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'StreamController',
                resolve: {
                    stream: vm.stream,
                    group: vm.groupInfo
                }
            });
            modalInstance.result.then(function () {
                $state.reload();
            });
        };
        vm.finishAssignment = function (assignment) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'finish-assignment.html',
                controller: 'FinishAssignmentController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                windowClass: 'FinishAssignmentController',
                resolve: {
                    data: assignment
                }
            });
        }
        vm.resetCode = function () {
            if(confirm('Thay đổi mã bảo mật?')){
                groupService.resetCode({groupId : vm.groupId}, function (res){
                    if (res.status == 'success'){
                        vm.groupInfo = res.data;
                    }
                },function(err){
                    console.log(err);
                })
            }
        }
    }
]).controller('StreamController',  ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', '$modalInstance', 'stream', 'group',
    function StreamController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, $modalInstance, stream, group) {
    var vm = this;
    vm.auth = Authentication;
    vm.groupInfo = group;
    console.log(vm.groupInfo);
    vm.subs = [];
    vm.chats = [];
    vm.session = {};
    var publisher;
    var session;

    var openTokApi= '46067612',
        openTokSecret= '0b0d13b6448702681d604e1835c7922fb581bcbb';
    vm.stream = stream;

    vm.stopSession = function () {
        groupService.stopSession({sid: vm.stream._id}, function (res) {
            if (res.status == 'success'){}
        },function (fail) {
            console.log(fail)
        })
    };
    if (vm.auth.user._id != vm.groupInfo.createdBy._id) {
        if (vm.stream && vm.stream._id) {
            console.log(vm.stream)
            var sessionId = vm.stream.sessionId;
            var sessionToken = vm.stream.token;
            session = OT.initSession(openTokApi, sessionId);
            session.connect(sessionToken, function connectCallback(error) {
                if (!error) {
                    console.log(session)
                } else {
                    console.log('There was an error connecting to the session: ', error.name, error.message);
                }
            });
            session.signal({
                    data: {
                        name: vm.auth.user.displayName,
                            content: "Đã tham gia",
                        time: Date.now()
                    }
                },
                function(error) {
                    if (error) {
                        console.log("signal error ("
                            + error.name
                            + "): " + error.message);
                    } else {
                        console.log("signal sent.");
                    }
                }
            );
            session.on('streamCreated', function(event) {
                if (event.stream.name === '') {
                    session.subscribe(event.stream, 'publisher', {
                        insertMode: 'append',
                        width: '100%',
                        height: '100%'
                    }, function (err) {
                        console.log(err)
                    });
                }
                else {
                    vm.subs.push(event.stream)
                }
            });
            session.on("signal", function(event) {
                vm.chats.push({
                    name: event.data.name,
                    content: event.data.content
                })
            });
            session.on("streamDestroyed", function (event) {
                console.log("The publisher stopped streaming. Reason: "
                    + event.reason);
                vm.close();
            });

        }else{
            toastr.warning('Giáo viên hiện đang offline');
            vm.close();
        }
    }
    if (vm.auth.user._id == vm.groupInfo.createdBy._id) {
        if (vm.stream && vm.stream._id) {
            vm.stopSession();
        }
        groupService.startSession({gid: vm.groupInfo._id}, function (res) {
            vm.session = res.session;
            vm.stream = res.data;
            var sessionId = vm.session.sessionId;
            var sessionToken = res.token;

            session = OT.initSession(openTokApi, sessionId);

            session.on('sessionDisconnected', function sessionDisconnected(event) {
                console.log('You were disconnected from the session.', event.reason);
            });
            // Connect to the session
            session.connect(sessionToken, function connectCallback(error) {
                // If the connection is successful, initialize a publisher and publish to the session
                if (!error) {
                    var publisherOptions = {
                        insertMode: 'append',
                        width: '100%',
                        height: '100%',
                        fitMode: 'contain',
                    };
                    publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(err) {
                        if (err) {
                            console.log('There was an error initializing the publisher: ', err.name, err.message);
                            return;
                        }
                        session.publish(publisher, function publishCallback(pubErr) {
                            if (pubErr) {
                                console.log('There was an error publishing: ', pubErr.name, pubErr.message);
                            }
                        });

                    });
                    publisher.on("streamDestroyed", function (event) {
                        console.log("The publisher stopped streaming. Reason: "
                            + event.reason);
                    });
                    publisher.on('streamCreated', function(event) {
                        console.log('Stream resolution: ' +
                            event.stream.videoDimensions.width +
                            'x' + event.stream.videoDimensions.height);
                    });
                    session.on("signal", function(event) {
                        console.log("Signal sent from connection " + event.from.id);
                        vm.chats.push({
                            name: event.data.name,
                            content: event.data.content
                        })
                    });
                } else {
                    console.log('There was an error connecting to the session: ', error.name, error.message);
                }
            });

        }, function (fail) {
            console.log(fail);
            toastr.warning('Có lỗi!');
            vm.close();
        })
    }
    vm.createComment = function (comment) {
        session.signal({
                    data: {
                        name: vm.auth.user.displayName,
                        content: comment,
                        time: Date.now()
                    }
                },
            function(error) {
                if (error) {
                    console.log("signal error ("
                        + error.name
                        + "): " + error.message);
                } else {
                    console.log("signal sent.");
                }
            }
        );
    }

    vm.close = function () {
        if (publisher && session) {
            publisher.destroy();
            session.disconnect();
            vm.stopSession();
        }
        $modalInstance.close();
    };

}]).controller('FinishAssignmentController',  ['$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService', '$modalInstance', 'data',
    function FinishAssignmentController($scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService, $modalInstance, data) {
    var vm = this;
    vm.assignment = data;
    vm.auth = Authentication;
    vm.studentAnswer = {};
    vm.studentAnswer.student = vm.auth.user._id;
    vm.studentAnswer.assignment = vm.assignment._id;

    vm.close = function () {
        $modalInstance.close();
    };
    vm.save = function () {
        vm.studentAnswer.answer = [];
        if(window.confirm('Bạn đã xem xét kỹ và muốn kết thúc khảo sát?')) {
            vm.assignment.questions.forEach(function (ques, index) {
                Object.entries(vm.studentAnswer.answers).map(function (val, key){
                    if (key === index){
                        var mapQA = {
                            question: ques.question,
                            answer: vm.studentAnswer.answers[key],
                            type: ques.type
                        };

                        vm.studentAnswer.answer.push(mapQA);
                    }
                });
            });
            groupService.createStudentAnswers({answer: vm.studentAnswer}, function(res) {
                if (res.status == 'success') {
                    toastr.success('Đã gửi!');
                    $state.reload();
                    vm.close();
                }
            }, function (fail) {
                toastr.warning('Có lỗi');
            })
        }
    }
}
]).controller('ViewAnswerController', ['$scope', '$http', 'Authentication', '$state', '$modal', 'toastr', 'groupService', '$modalInstance', 'data',
    function ViewAnswerController($scope, $http, Authentication, $state, $modal, toastr, groupService, $modalInstance, data) {
        var vm = this;
        vm.close = function () {
            $modalInstance.close();
        };
        vm.assignment = data;
    }
]);
