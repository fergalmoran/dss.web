'use strict';

angular.module('dssWebApp')
    .controller('ScheduleCtrl', function ($scope, dialogs, ShowModel, shows) {
        $scope.message = 'Hello';
        var calendar = $('#calendar').fullCalendar({
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            lang: 'en-gb',
            firstDay: 1,
            editable: true,
            droppable: true,
            defaultView: 'agendaWeek',
            scrollTime: '13:00',
            eventClick: eventClick,
            eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                event.model.start_date = event.start.utc().format();
                event.model.end_date = event.end.utc().format();
                ShowModel.update(event.id, event.model).then(function (result) {
                    console.log(result);
                });
            },
            eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                event.model.start_date = event.start.utc().format();
                event.model.end_date = event.end.utc().format();
                ShowModel.update(event.id, event.model).then(function (result) {
                    console.log(result);
                });
            }
        });

        function eventClick(calEvent, jsEvent, view) {
            console.log(calEvent, jsEvent, view);
            $scope.addShow(calEvent.model);
        }

        function renderShows() {
            $('#calendar').fullCalendar('removeEvents');
            shows.forEach(function (show) {
                console.log("Show", show);
                $('#calendar').fullCalendar('renderEvent', {
                    id: show.id,
                    title: show.description,
                    start: show.start_date,
                    end: show.end_date,
                    model: show
                }, true);
            });

        }

        renderShows();

        $scope.addShow = function (data) {
            var vm = data || {
                    start_date: new Date(),
                    recurrence: 1,
                    performer: {
                        id: -1,
                        title: ''
                    },
                    description: ''
                };
            var dlg = dialogs.create('app/views/schedule/eventDialog.html', 'addEventDialogCtrl', {
                title: 'You sure chief?',
                body: 'Delete this comment?',
                shows: shows,
                editing: data || false,
                vm: vm
            }, {
                size: 'lg',
                keyboard: true,
                backdrop: true
            });
            dlg.result.then(function (result) {
                console.log(result);
                if (result.vm && !result.editing) {
                    shows.push(result.vm);
                }
                if (result.refresh) {
                    renderShows();
                }
            });
        };
    }).controller('addEventDialogCtrl', function ($scope, $modalInstance, dialogs, $http, ShowModel, SERVER_CONFIG, data) {
    $scope.vm = data.vm;
    //get the date into proper format
    $scope.errors = {};
    $scope.editing = data.editing;
    $scope.doClose = function (result) {
        if (result) {
            if (!$scope.vm.description) {
                $scope.errors.description = "Description is required";
            }
            if (!$scope.vm.performer || $scope.vm.performer.id == -1) {
                $scope.errors.performer = "Please select a Dj";
            }
            if (_.isEmpty($scope.errors)) {
                if ($scope.editing) {
                    ShowModel.update($scope.vm.id, {
                        start_date: moment.utc($scope.vm.start_date, "DD/MM/YYYY - HH:00").format(),
                        recurrence: $scope.vm.recurrence,
                        description: $scope.vm.description,
                        mix: $scope.vm.mix,
                        performer: $scope.vm.performer.id
                    }).then(function (result) {
                        $modalInstance.close({refresh: true, vm: result, editing: true});
                    });
                } else {
                    ShowModel.create({
                        start_date: moment.utc($scope.vm.start_date, "DD/MM/YYYY - HH:00").format(),
                        recurrence: $scope.vm.recurrence,
                        description: $scope.vm.description,
                        mix: $scope.vm.mix,
                        performer: $scope.vm.performer.id
                    }).then(function (result) {
                        $modalInstance.close({refresh: true, vm: result, editing: false});
                    });
                }
            }
        } else {
            $modalInstance.close({refresh: false});
        }
    };
    $scope.doDelete = function () {
        var dlg = dialogs.create('app/dialogs/confirm/confirmDialog.html', 'confirmDialogCtrl', {
            title: "Delete this event?",
            body: $scope.vm.description
        });
        dlg.result.then(function (result) {
            if (result) {
                ShowModel.destroy($scope.vm.id).then(function () {
                    $modalInstance.close({refresh: true});
                });
                ShowModel.save();
            }
        });
    };
});
