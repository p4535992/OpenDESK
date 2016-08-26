
    angular
        .module('openDeskApp.notifications')
        .controller('NotificationsController', NotificationsController)
        .directive('odNotifications', function() {
            return {
              restrict: 'E',
              scope: false,
              templateUrl: '/app/src/odNotifications/view/notifications.html'
            };
        });


    function NotificationsController($scope, $timeout, $log, $mdToast, notificationsService, sessionService, authService) {
        var vm = this;
				
				var userInfo = sessionService.getUserInfo();
				var currentUser = userInfo.user.userName;
				

        vm.notifications = new Array();
        vm.on = false;
        vm.toggleNotices = function() {
            vm.on = !vm.on;
        }

        // Popup a notice
        vm.popNotice = function(noticeObj) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(noticeObj.notice)
                    .position('top right')
                    .action('Luk')
            );
        };
        

        notificationsService.getNotices(authService.getUserInfo().user.userName).then (function (val) {
            $scope.notifications = val;
        });

        vm.rmNotice = function(nIndex) {
						notificationsService.delNotice(currentUser, nIndex).then(function(){
							
			        notificationsService.getNotices(currentUser).then (function (val) {
			            vm.notifications = val;
			        });
						});
        };
				
				vm.setRead = function(noticeObj) {
					notificationsService.setReadNotice(currentUser, noticeObj).then(function(val){
						console.log("check");
		        notificationsService.getNotices(currentUser).then (function (val) {
		            vm.notifications = val;
		        });
					});
				};

        vm.addNotice = function() {
            vm.popNotice({notice: 'Hey there'});
            vm.notifications.push({notice: 'Hey there'});
        };
        $timeout(vm.addNotice(), 3000);

    };
