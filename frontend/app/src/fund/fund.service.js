//
// Copyright (c) 2017-2018, Magenta ApS
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

'use strict'

angular.module('openDeskApp.fund')
  .factory('fundService', ['$http', FundService]);

  function FundService ($http) {

    var service = {
      getBranches: getBranches,
      getBranch: getBranch,
      addBranch: addBranch,
      getWorkflows: getWorkflows,
      getActiveWorkflows : getActiveWorkflows,
      getWorkflow: getWorkflow,
      getWorkflowState : getWorkflowState,
      getApplication : getApplication,
      getNewApplications : getNewApplications,
      getApplicationsByBranch: getApplicationsByBranch,
      setApplicationState : setApplicationState,
      resetDemoData : resetDemoData
    }

    return service

    function getBranches() {
      return $http.get(`/alfresco/service/foundation/branch`)
      .then(function (response) {
        return response.data
      })
    }

    function getBranch(nodeID) {
      return $http.get(`/alfresco/service/foundation/branch/${nodeID}`)
      .then(function (response) {
        return response.data
      })
    }

    function addBranch(branchTitle) {
      var payload = {title: branchTitle}
      return $http.post(`/alfresco/service/foundation/branch`, payload)
      .then(function(response){
        return response
      })
    }

    function getWorkflows() {
      return $http.get(`/alfresco/service/foundation/workflow`)
      .then(function (response) {
        return response.data
      })
    }

    function getActiveWorkflows() {
      return $http.get(`/alfresco/service/foundation/activeworkflow`)
      .then(function (response) {
        return response.data
      })
    }

    function getWorkflow(workflowID) {
      return $http.get(`/alfresco/service/foundation/workflow/${workflowID}`)
      .then(function (response) {
        return response.data
      })
    }

    function getWorkflowState(stateID) {
      return $http.get(`/alfresco/service/foundation/state/${stateID}`)
      .then(function (response) {
        return response.data
      })
    }

    function getApplication(applicationID) {
      return $http.get(`/alfresco/service/foundation/application/${applicationID}`)
      .then(function (response) {
        return response.data
      })
    }

    function getNewApplications() {
      return $http.get(`/alfresco/service/foundation/incomming`)
      .then(function (response) {
        return response.data
      })
    }

    function getApplicationsByBranch(nodeID) {
      return $http.get(`/alfresco/service/foundation/branch/${nodeID}/applications`)
      .then(function (response) {
        return response.data
      })
    }

    function setApplicationState(applicationID, stateID) {
      var payload = {state: {nodeID: stateID}}
      return $http.post(`/alfresco/service/foundation/application/${applicationID}`, payload)
      .then(function (response) {
        return response.data
      })
    }

    function resetDemoData() {
      return $http.post(`/alfresco/service/foundation/demodata`)
      .then(function (response) {
          console.log(response)
        return response.data
      })
    }
  }