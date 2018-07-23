import $ from 'jquery'
import 'angular'
import 'angular-auto-height'
import 'angular-cookies'
import 'angular-drag-and-drop-lists'
import 'angular-img-fallback'
import 'angular-material'
import 'angular-messages'
import 'angular-resource'
import 'angular-sanitize'
import 'angular-swfobject'
import 'angular-translate'
import 'angular-translate-loader-static-files'
import 'angular-ui-router'
import 'ckeditor'
import 'isteven-angular-multiselect/isteven-multi-select'
import 'ng-ckeditor'

import 'angular-material/angular-material.css'
import 'angular-material-data-table/dist/md-data-table.min.css'
import 'isteven-angular-multiselect/isteven-multi-select.css'

// Modules
import './app.module'
import './init.module'
import './backendConfig.module'
import './translations'
import './authentication'
import './header'
import './dashboard'
import './system_settings'
import './notifications'
import './user'
import './appDrawer'
import './filebrowser'
import './odSite'
import './group'
import './lool'
import './documents'
import './onlyOffice'
import './odDocuments'
import './odDiscussion'
import './search'
import './searchBar'
// import './odChat' Not added because it has not been maintained and converse is not managed by npm

// Components
import './components/members'
import './components/odEmail'

// Shared Services
import './shared/services/alfrescoNodeUtilsService'
import './shared/services/browserService'
import './shared/services/content.service'
import './shared/services/editOnlineMSOfficeService'
import './shared/services/fileUtilsService'
import './shared/services/member.service'
import './shared/services/translateService'
import './shared/services/document/preview/preview.controller'
import './shared/services/document/preview/preview.service'

// Shared Filters
import './shared/filters/customDateFilter'
import './shared/filters/exactMatchFilter'
import './shared/filters/isContainedFilter'
import './shared/filters/openeDateFilter'
import './shared/filters/orderByObjectFilter'

import './app.scss'

window.$ = $

function importAll (r) {
  r.keys().forEach(r)
}

importAll(
  require.context('./', true, /.*\.scss$/)
)

importAll(
  require.context('./', true, /.*\.html$/)
)

angular.element(document).ready(function () {
  angular.bootstrap(document, ['openDeskApp'])
})
