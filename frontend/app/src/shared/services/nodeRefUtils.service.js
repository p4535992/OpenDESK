// 
// Copyright (c) 2017-2018, Magenta ApS
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// 

'use strict'

angular.module('openDeskApp').factory('nodeRefUtilsService', nodeRefUtilsService)

function nodeRefUtilsService () {
  return {
    getId: function (nodeRef) {
      return nodeRef.split('/')[3]
    }
  }
}
