'use strict';

angular
    .module('openDeskApp.site')
    .controller('SiteMemberController', SiteMemberController);

function SiteMemberController($scope, $stateParams, $mdDialog, siteService, groupService, alfrescoDownloadService, sessionService) {
    var vm = this;
    
    vm.doPDF = doPDF;
    vm.openMemberInfo = groupService.openMemberInfo;
    vm.loadMembers = loadMembers;
    vm.editSiteGroups = editSiteGroups;
    vm.site = {};
    vm.permissions = {};

    $scope.siteService = siteService;

    activate();

    $scope.$watch('siteService.getSite()', function (site) {
        vm.site = site;
        loadMembers();
    });

    $scope.$on('updateMemberList', function() {
        loadMembers();
    });   

    function activate() {
        getSiteUserPermissions();
    }

    function getSiteUserPermissions() {
        siteService.getSiteUserPermissions($stateParams.projekt).then(
            function (permissions) {
                vm.permissions = permissions;
            }
        );
    }

    function doPDF() {
        siteService.createMembersPDF(vm.site.shortName).then(function (response) {
            alfrescoDownloadService.downloadFile("workspace/SpacesStore/" + response[0].Noderef, "Medlemsliste.pdf");
        });
    }

    function loadMembers() {
        siteService.getGroupsAndMembers(vm.site.shortName).then(function (groups) {
            vm.groups = groups;
        });
    }

    function editSiteGroups(ev) {
        $mdDialog.show({
            templateUrl: 'app/src/odSite/editMembers/editMembers.tmpl.html',
            controller: 'EditSiteMemberController',
            controllerAs: 'vm',
            locals: {
                sitedata: vm.site
            },
            targetEvent: ev,
            clickOutsideToClose: true
        });
    }
}