// 
// Copyright (c) 2017-2018, Magenta ApS
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// 

'use strict'
import editMembersTemplate from '../editMembers/editMembers.tmpl.html'

angular
  .module('openDeskApp.site')
  .controller('SiteMemberController', ['$scope', '$stateParams', '$mdDialog', 'siteService', 'groupService', 'alfrescoDownloadService', SiteMemberController])

function SiteMemberController ($scope, $stateParams, $mdDialog, siteService, groupService, alfrescoDownloadService) {
  var vm = this

  vm.doPDF = doPDF
  vm.openMemberInfo = groupService.openMemberInfo
  vm.loadMembers = loadMembers
  vm.skipCount = 0,
  vm.maxItems = 10, // Set to a low number for testing, but use "10" for production
  vm.paginateMembersBackward = paginateMembersBackward,
  vm.paginateMembersForward = paginateMembersForward,
  vm.editSiteGroups = editSiteGroups
  vm.site = {}
  vm.permissions = {}

  $scope.siteService = siteService

  activate()

  $scope.$watch('siteService.getSite()', function (site) {
    vm.site = site
    loadMembers(vm.maxItems, vm.skipCount)
  })

  $scope.$on('updateMemberList', function () {
    loadMembers()
  })

  function activate () {
    getSiteUserPermissions()
  }

  function getSiteUserPermissions () {
    siteService.getSiteUserPermissions($stateParams.projekt)
      .then(function (permissions) {
        vm.permissions = permissions
      })
  }

  function doPDF () {
    siteService.createMembersPDF(vm.site.shortName)
      .then(function (response) {
        alfrescoDownloadService.downloadFile('workspace/SpacesStore/' + response[0].Noderef, 'Medlemsliste.pdf')
      })
  }

  function loadMembers (maxItems, skipCount) {
    siteService.getUsers(vm.site.shortName, maxItems, skipCount)
    .then(function (groups) {
      vm.groups = groups
    })
  }

  function paginateMembersBackward() {
    vm.newSkipCount = vm.skipCount -= vm.maxItems;
    loadMembers(vm.maxItems, vm.newSkipCount);
  }

  function paginateMembersForward() {
    vm.newSkipCount = vm.skipCount += vm.maxItems;
    loadMembers(vm.maxItems, vm.newSkipCount);
  }

  function editSiteGroups (ev) {
    $mdDialog.show({
      template: editMembersTemplate,
      controller: 'EditSiteMemberController',
      controllerAs: 'vm',
      locals: {
        sitedata: vm.site
      },
      targetEvent: ev,
      clickOutsideToClose: true
    })
  }
}
