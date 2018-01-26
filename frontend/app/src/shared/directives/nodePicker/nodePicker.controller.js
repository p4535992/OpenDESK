'use strict';

angular
    .module('openDeskApp')
    .controller('NodePickerController', NodePickerController);

function NodePickerController($scope, alfrescoDocumentService) {

    var vm = this;

    vm.getNode = getNode;
    vm.browseParent = browseParent;
    vm.browseChild = browseChild;
    vm.pickNode = pickNode;
    vm.currentNode = [];
    
    activate();

    function activate() {
        console.log('start node picker');
        alfrescoDocumentService.retrieveNodeInfo($scope.currentNodeRef).then(function (currentNode) {
            console.log("currentNode");
            console.log(currentNode);
            vm.currentNode = currentNode;
        });
    }

    function getNode(nRef) {
        return alfrescoDocumentService.retrieveNodeInfo(nRef);
    }

    function browseParent() {
        $scope.model = undefined;
        alfrescoDocumentService.retrieveNodeInfo(vm.currentNode[0].primaryParent_nodeRef).then(function (currentNode) {
            vm.currentNode = currentNode;
        });
    }

    function browseChild(childNodeRef) {
        $scope.model = undefined;
        alfrescoDocumentService.retrieveNodeInfo(childNodeRef).then(function (currentNode) {
            vm.currentNode = currentNode;
        });
    }

    function pickNode(nRef) {
        if ($scope.model === nRef) {
            $scope.model = undefined;
        } else {
            $scope.model = nRef;
        }
    }
}