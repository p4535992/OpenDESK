angular
    .module('openDeskApp.dashboard')
    .controller('DashboardController', DashboardController);

function DashboardController(pageService, headerService, APP_CONFIG) {
    var vm = this;
    
    vm.links = APP_CONFIG.settings.dashboardLinks;
    vm.pages = [];

    headerService.setTitle('');

    pageService.addPage(vm.pages, 'DASHBOARD.INTRA', vm.links['intra'], "intra");
    pageService.addPage(vm.pages, 'DASHBOARD.EMAIL', vm.links['email'], "mail");
    pageService.addPage(vm.pages, 'DASHBOARD.CALENDAR', vm.links['calendar'], "calendar");
    pageService.addPage(vm.pages, 'DASHBOARD.PROJECTS',  vm.links['projects'], "project");
    pageService.addPage(vm.pages, 'DASHBOARD.KEY_NUMBERS', vm.links['keyNumbers'], "timeline");
    pageService.addPage(vm.pages, 'DASHBOARD.WORK_TIME', vm.links['workTime'], "money");
    pageService.addPage(vm.pages, 'DASHBOARD.ESDH', vm.links['esdh'], "library");
    pageService.addPage(vm.pages, 'DASHBOARD.CITRIX', vm.links['citrix'], "business");
    pageService.addPage(vm.pages, 'DASHBOARD.MAP', vm.links['map'], "map");

}