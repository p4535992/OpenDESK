'use strict';

angular.module('openDeskApp.documents')
    .controller('DocumentController', DocumentController);

function DocumentController($scope, documentService, $stateParams, $location, documentPreviewService, alfrescoDownloadService, $mdDialog, notificationsService, authService, cmisService) {
    
    var vm = this;
    vm.doc = [];
    vm.plugin = [];
    vm.paths = [];
	vm.title = [];
	

    console.log("$stateParams");
    console.log($stateParams);
	
	var parentDocumentNode = "";
	var selectedDocumentNode = "";

    if($location.search().archived !=  undefined && $location.search().parent !=  undefined)
    {
        vm.showArchived = $location.search().archived;
		parentDocumentNode = $location.search().parent;
		document.getElementById("historyBox").checked = false;
		selectedDocumentNode = $stateParams.doc;
    }
    else{
        vm.showArchived = false;
		parentDocumentNode = $stateParams.doc;
    }


    documentService.getHistory(parentDocumentNode).then (function (val){
        $scope.history = val;
    });

	vm.selectFile = function(event){
        var file = event.target.value;
		var fileName = file.replace(/^C:\\fakepath\\/, "");
		document.getElementById("uploadFile").innerHTML = fileName;		
    };
	
	vm.cancel = function() {
		$mdDialog.cancel();
	};

    vm.newFolderDialog = function (event) {
        $mdDialog.show({
            templateUrl: 'app/src/documents/view/reviewComment.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: true
        });
    };
	
	vm.uploadNewVersionDialog = function (event) {
		$mdDialog.show({
			templateUrl: 'app/src/documents/view/uploadNewVersion.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: event,
			scope: $scope,        // use parent scope in template
			preserveScope: true,  // do not forget this if use parent scope
			clickOutsideToClose: true
		});
	};

	
    vm.uploadNewVersion = function (files) {

        var cmisQuery = $stateParams.projekt  + "/documentLibrary/" + $stateParams.path;


        cmisService.getNode(cmisQuery).then(function (val) {

            var currentFolderNodeRef = val.data.properties["alfcmis:nodeRef"].value;

            for (var i = 0; i < files.length; i++) {
                siteService.uploadFiles(files[i], currentFolderNodeRef).then(function(response){
                    vm.loadContents();
                } );
            }
            $mdDialog.cancel();

        });
    };

    vm.getVersion = function (version) {

    }


    // prepare to handle a preview of a document to review
    var paramValue = $location.search().dtype;

    if (paramValue == "wf") {
        vm.wf_from = $location.search().from;
        vm.wf_doc = $location.search().doc;
        vm.wf = true;
    }

    vm.createWFNotification = function(comment) {

        notificationsService.addWFNotice(authService.getUserInfo().user.userName, vm.wf_from, "review svar", comment, vm.wf_doc, "wf-response").then (function (val) {
            $mdDialog.hide();
        });
    }

    //vm.createReviewNotification = function (documentNodeRef, receiver, subject, comment) {
    //
    //    var s = documentNodeRef.split("/");
    //    var ref = (s[3])
    //
    //    notificationsService.addWFNotice(authService.getUserInfo().user.userName, receiver, subject, comment, ref, "wf-response").then (function (val) {
    //        $mdDialog.hide();
    //    });
    //
    //
    //}
	

    documentService.getDocument(parentDocumentNode).then(function(response) {
		
		if (document.getElementById(selectedDocumentNode) != undefined) {
			document.getElementById(selectedDocumentNode).style.backgroundColor = "#ccc";
			document.getElementById(selectedDocumentNode).style.lineHeight = "2";
		}
		
        vm.doc = response.item;

        // Compile paths for breadcrumb directive
        vm.paths = buildBreadCrumbPath(response);
		
		vm.title = response.item.location.siteTitle;
        
        function buildBreadCrumbPath(response) {
                var paths = [
                    {
                        title: 'Projekter',
                        link: '#/projekter'
                    },
                    {
                        title: response.item.location.siteTitle,
                        link: '#/projekter/' + response.item.location.site
                    }
                ];
                var pathArr = response.item.location.path.split('/');
                var pathLink = '/';
                for (var a in pathArr) {
                    if (pathArr[a] !== '') {
                        paths.push({
                            title: pathArr[a],
                            link: '#/projekter/' + response.item.location.site + pathLink + pathArr[a]
                        });
                        pathLink = pathLink + pathArr[a] + '/';
                    };
                };
                paths.push({
                    title: response.item.location.file,
                    link: response.item.location.path
                });
                return paths;
        };
        
    });

    if (vm.showArchived) {
        //console.log("true");
        vm.store = 'versionStore://version2Store/'
    }
    else {
        //console.log("false");
        vm.store = 'workspace://SpacesStore/'
    }

    documentPreviewService.previewDocumentPlugin(vm.store + $stateParams.doc).then(function(plugin){
        
        vm.plugin = plugin;
        $scope.config = plugin;
        $scope.viewerTemplateUrl = documentPreviewService.templatesUrl + plugin.templateUrl;

        $scope.download = function(){
            alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
        };
        
        if(plugin.initScope){
            plugin.initScope($scope);
        }
        
    });



    
};
