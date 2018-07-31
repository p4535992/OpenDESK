'use strict'
import reviewDetailTemplate from './reviewDetail.view.html'
import reviewListTemplate from './reviewList.view.html'

angular.module('od.review')
  .controller('ReviewController', ['reviewService', '$mdDialog', ReviewController])
  .directive('odReviewList', odReviewList)
  .directive('odReviewDetail', odReviewDetail)

function ReviewController (reviewService, $mdDialog) {
  var vm = this

  vm.approve = approve
  vm.reject = reject
  vm.create = create
  vm.cancelDialog = cancelDialog

  function create () {
    console.log('create review')
    console.log(vm.member)
    console.log(vm.comment)
    reviewService.create()
  }

  function approve () {
    console.log('approve review')
    reviewService.approve()
  }

  function reject () {
    console.log('reject review')
    reviewService.reject()
  }

  function cancelDialog () {
    $mdDialog.cancel()
  }
}

function odReviewList () {
  return {
    restrict: 'E',
    scope: {
      items: '=items'
    },
    template: reviewListTemplate,
    controller: 'ReviewController',
    controllerAs: 'vm'
  }
}

function odReviewDetail () {
  return {
    restrict: 'E',
    scope: {
      review: '=item'
    },
    template: reviewDetailTemplate
  }
}
