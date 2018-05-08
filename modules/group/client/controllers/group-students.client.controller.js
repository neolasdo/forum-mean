(function () {
    'use strict';

    angular
        .module('group')
        .controller('GroupStudentsController', GroupStudentsController)
        .controller('AddStudentsController', AddStudentsController);

    GroupStudentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];
    AddStudentsController.$inject = ['$rootScope', '$scope', '$http', '$stateParams', '$modalInstance', 'Authentication', '$state', '$modal', 'toastr', 'groupService'];

    function GroupStudentsController($rootScope, $scope, $http, $stateParams, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;

        vm.groupId = $stateParams.id;
        vm.students = [];
        groupService.get({id: vm.groupId}, function (res) {
            if (res.status == 'success') {
                vm.groupInfo = res.data;
            }
        })

        vm.getStudents = function () {
            groupService.getStudents({id: vm.groupId}, function (res) {
                if (res.status == 'success') {
                    vm.students = res.data;
                }
            }, function (err) {
                console.log(err);
            })
        }
        vm.getStudents();
        vm.removeStudent = function (id) {
            if (window.confirm('Bạn có chắc muốn xóa học viên này?')) {
                groupService.removeStudent({id: vm.groupId, uid: id}, function (res) {
                    if (res.status == 'success') {
                        toastr.success('Đã xóa thành công');
                        $state.reload();
                    }
                }, function (err) {
                    console.log(err)
                })
            }
        }
        vm.addStudents = function () {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'add-students-modal.html',
                controller: 'AddStudentsController',
                controllerAs: 'vm',
                size: 'md',
                windowClass: 'AddStudentsController'
            });
            modalInstance.result.then(function () {
                vm.getStudents();
            });
        }
    }

    function AddStudentsController($rootScope, $scope, $http, $stateParams, $modalInstance, Authentication, $state, $modal, toastr, groupService) {
        var vm = this;
        vm.auth = Authentication;
        vm.add = [];
        vm.students = [];
        vm.studentJoined = [];
        vm.groupId = $stateParams.id;
        vm.csvFile = null;
        vm.disabled = false;
        vm.close = function () {
            $modalInstance.close();
        };
        vm.getStudents = function () {
            groupService.getStudents({id: vm.groupId}, function (res) {
                if (res.status == 'success') {
                    vm.studentJoined = res.data;
                    vm.getListStudent();
                }
            }, function (err) {
                console.log(err);
            })
        }
        vm.getListStudent = function () {
            $http.get('/api/users/getAllStudent').then(function (res) {
                vm.students = res.data;
                if (vm.studentJoined.length) {
                    vm.studentJoined.forEach(function (item) {
                        var index = vm.students.findIndex(function (student) {
                            return student._id === item.student._id;
                        });
                        vm.students.splice(index, 1);
                    })
                }
            })
        }
        vm.getStudents();
        vm.readFile = function(){
            if (this.files && this.files[0]) {
                var FR= new FileReader();
                FR.readAsText( this.files[0] );
                FR.addEventListener("load", function(e) {
                    vm.csvFile = e.target.result;
                    var add = CSV2JSON(vm.csvFile);
                    vm.checkAdd(JSON.parse(add));
                });
            }
        }
        
        vm.chooseFile =  function () {
            var input = document.querySelector('input[type=file]');
            input.addEventListener("change", vm.readFile);
        };
        function checkIsEmail(string) {
            var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            return pattern.test(string);
        }
        vm.checkAdd = function (add) {
            angular.forEach(add, function (item) {
                if(item.hasOwnProperty('email') && checkIsEmail(item.email)) {
                    var data = {};
                    data.email = item.email;
                    data.firstName = item.first_name?item.first_name:'';
                    data.lastName = item.last_name?item.last_name:'';
                    data.username = item.user_name?item.user_name:item.email;
                    data.displayName = item.first_name + ' '+ item.last_name;
                    data.profileImageURL = item.img_url?item.img_url:'';
                    data.roles = 'student';
                    data.provider  = 'local';

                    vm.add.push(data);
                }
            });

            (vm.add.length > 0)?vm.disabled = true: vm.disabled = false;
        }
        vm.save = function () {
            if (vm.add.length) {
                groupService.addStudents({id: vm.groupId}, {students: vm.add}, function (res) {
                    if (res.status == 'success') {
                        toastr.success('Thêm thành công');
                        vm.close();
                    }
                }, function (err) {
                    console.log(err);
                })
            }
        }
        function CSVToArray(strData, strDelimiter) {
            strDelimiter = (strDelimiter || ",");
            var objPattern = new RegExp((
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
            var arrData = [[]];
            var arrMatches = null;
            while (arrMatches = objPattern.exec(strData)) {
                var strMatchedDelimiter = arrMatches[1];
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    arrData.push([]);
                }
                if (arrMatches[2]) {
                    var strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"), "\"");
                } else {
                    var strMatchedValue = arrMatches[3];
                }
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            return (arrData);
        }

        function CSV2JSON(csv) {
            var array = CSVToArray(csv);
            var objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }

            var json = JSON.stringify(objArray);
            var str = json.replace(/},/g, "},\r\n");

            return str;
        }
    }
})();
