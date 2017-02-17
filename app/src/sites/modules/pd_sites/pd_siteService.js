'use strict';

angular
    .module('openDeskApp.pd_sites')
    .factory('pd_siteService', function ($http, $window, alfrescoNodeUtils, userService, documentService, groupService, siteModuleService) {
    
        var restBaseUrl = '/alfresco/s/api/';
        
     
        var service = {
            createPDSite: createPDSite,
            addTemplate: addTemplate,
            getAllManagers: getAllManagers,
            getAllOrganizationalCenters: getAllOrganizationalCenters
        };
        
        
        siteModuleService.registerProjectType('PD-Project', 'app/src/sites/modules/pd_sites/view/sitesActionsMenu.html');


        var restBaseUrl = '/alfresco/s/api/';
        var service = {
            createPDSite: createPDSite,
            addTemplate: addTemplate,
            getAllManagers: getAllManagers,
            getAllOrganizationalCenters: getAllOrganizationalCenters
        };


        function createPDSite(siteName, description, sbsys, center_id, owner, manager) {
            return $http.post('/alfresco/service/projectdepartment', {
                PARAM_NAME: siteName,
                PARAM_DESCRIPTION: description,
                PARAM_SBSYS: sbsys,
                PARAM_OWNER: owner,
                PARAM_MANAGER: manager,
                PARAM_CENTERID: center_id,
                PARAM_METHOD: "createPDSITE"
            }).then(function (response) {
                console.log(response);
                return response;
            });
        }


        function addTemplate(siteName, template) {
            return $http.post('/alfresco/service/projectdepartment', {
                PARAM_NAME: siteName,
                PARAM_TEMPLATE: template
            }).then(function (response) {
                console.log(response);
                return response;
            });
        }


        function getAllManagers() {
            return groupService.getGroupMembers("GLOBAL_Projectmanagers").then(
                function (response) {
                    console.log(response.data);
                    return response;
                },
                function (err) {
                    console.log(err);
                }
            );
        }


        function getAllOrganizationalCenters() {
            return groupService.getGroupMembers("OrganizationalCenters").then(function (response) {
                console.log(response);
                return response;
            });
        }


        return service;

    });
