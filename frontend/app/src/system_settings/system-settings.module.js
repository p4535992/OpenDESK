'use strict';

angular
    .module('openDeskApp.systemsettings', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('systemsettings', {
        parent: 'site',
        url: '/administration',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'content@': {
                templateUrl: 'app/src/system_settings/system_settings.html',
                controller: 'SystemSettingsController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.notifications', {
        url: '/notifikationer',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/notifications/view/notifications.html',
                controller: 'NotificationsSettingsController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.folder_templates', {
        url: '/mappeskabeloner',
        params: {
            authorizedRoles: [USER_ROLES.admin],
            path: "/Data Dictionary/Space Templates",
            isSite: false
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/filebrowser/view/filebrowserCard.html',
                controller: 'FilebrowserController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.document_templates', {
        url: '/dokumentskabeloner',
        params: {
            authorizedRoles: [USER_ROLES.admin],
            path: "/Data Dictionary/Node Templates",
            isSite: false
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/filebrowser/view/filebrowserCard.html',
                controller: 'FilebrowserController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.templateList', {
        url: '/skabeloner',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/templates/view/templateList.html',
                controller: 'TemplatesController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.filebrowser', {
        url: '/systemmapper{path:SlashFix}',
        params: {
            authorizedRoles: [USER_ROLES.admin],
            isSite: false
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/filebrowser/view/filebrowserCard.html',
                controller: 'FilebrowserController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.config', {
        url: '/konfiguration',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/config/view/config.html',
                controller: 'ConfigController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.groups', {
        url: '/grupper',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/groups/view/groups.html',
                controller: 'SettingsGroupsController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.text_templates', {
        url: '/tekstskabeloner{path:SlashFix}',
        params: {
            authorizedRoles: [USER_ROLES.admin],
            path: "/Data Dictionary/Web Scripts Extensions/OpenDesk/Templates",
            isSite: false
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/filebrowser/view/filebrowserCard.html',
                controller: 'FilebrowserController',
                controllerAs: 'vm'
            }
        }
    }).state('systemsettings.text_template_edit', {
        url: '/tekstskabelon/{doc:SlashFix}',
        params: {
            authorizedRoles: [USER_ROLES.admin]
        },
        views: {
            'systemsetting-view': {
                templateUrl: 'app/src/system_settings/text_templates/view/edit.html',
                controller: 'EmailTemplatesController',
                controllerAs: 'vm'
            }
        }
    });
}