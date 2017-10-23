angular
    .module('openDeskApp.header')
    .controller('HeaderController', HeaderController);

function HeaderController($scope, $state, $mdSidenav, headerService, authService, notificationsService) {
    var vm = this;

    vm.title = '';
    vm.toggleAppDrawer = buildToggler('appDrawer');
    vm.toggleNotifications = buildToggler('notifications');
    vm.toggleSystemSettings = toggleSystemSettings;
    vm.toggleUserPanel = buildToggler('userpanel');
    vm.unseenNotifications = 0;
    vm.user = authService.getUserInfo().user;

    function toggleSystemSettings() {
        $state.go('systemsettings');
    }

    $scope.headerService = headerService;
    $scope.notificationsService = notificationsService;

    $scope.$watch('headerService.getTitle()', function (newVal) {
        $scope.title = newVal;
    });

    $scope.$watch('notificationsService.getUnseenCount()', function (newVal) {
        $scope.unseenNotifications = newVal;
    });

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID).toggle();
        };
    }
}