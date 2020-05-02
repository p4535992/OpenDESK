// 
// Copyright (c) 2017-2018, Magenta ApS
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// 

'use strict'
import userPanelTemplate from './userPanel.view.html'

angular
  .module('openDeskApp.user')
  .directive('odUserPanel', function () {
    return {
      restrict: 'E',
      scope: {},
      template: userPanelTemplate,
      controller: 'UserController',
      controllerAs: 'vm'
    }
  })
