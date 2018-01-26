'use strict';

angular
    .module('openDeskApp.appDrawer')
    .controller('AppDrawerController', AppDrawerController);

function AppDrawerController($mdSidenav, pageService, APP_BACKEND_CONFIG) {
    var vm = this;
    
    vm.close = close;
    vm.links = APP_BACKEND_CONFIG.dashboardLink;
    // vm.pages = [];

    activate();

    function activate() {
        // pageService.addPage(vm.pages, 'DASHBOARD', vm.links.dashboard, "dashboard");
        // pageService.addPage(vm.pages, 'DASHBOARD.INTRA', vm.links.intra, "intra");
        // pageService.addPage(vm.pages, 'DASHBOARD.EMAIL', vm.links.email, "mail");
        // pageService.addPage(vm.pages, 'DASHBOARD.CALENDAR', vm.links.calendar, "calendar");
        // pageService.addPage(vm.pages, 'DASHBOARD.PROJECTS',  vm.links.projects, "project");
        // pageService.addPage(vm.pages, 'DASHBOARD.KEY_NUMBERS', vm.links.keyNumbers, "timeline");
        // pageService.addPage(vm.pages, 'DASHBOARD.WORK_TIME', vm.links.workTime, "money");
        // pageService.addPage(vm.pages, 'DASHBOARD.ESDH', vm.links.esdh, "library");
        // pageService.addPage(vm.pages, 'DASHBOARD.CITRIX', vm.links.citrix, "business");
        // pageService.addPage(vm.pages, 'DASHBOARD.MAP', vm.links.map, "map");
    }

    function close() {
        $mdSidenav('appDrawer').close();
    }
}