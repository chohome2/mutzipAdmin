'use strict';

angular.module('mutzipAdminApp')
    .controller('NoticeCtrl', function ($scope, $state, $timeout, $rootScope, $stateParams, Auth, Notice) {
        $scope.isAdmin = Auth.isAdmin();
		$scope.noticeList = [];
		$scope.createClassify = 'NOTICE';
		$("#createContent").wysihtml5();
		Notice.getNoticeList().success(function (ret) {
			console.log(ret);
			$scope.noticeList = ret.data;
		});
		$scope.clickNotice = function(title,content) {
			$scope.noticeTitle = title;
			$scope.noticeContent = content;
			$('#noticeModal').modal();
		};
		$scope.create = function() {
			if(!$scope.createTitle || $scope.createTitle.trim().length == 0) {
				$rootScope.error = '제목을 입력해 주세요';
				return;
			}
			if(!$('#createContent').val() || $('#createContent').val().trim().length == 0) {
				$rootScope.error = '본문을 입력해 주세요';
				return;
			}
			var data = jQuery.param({
				'type' : $scope.createClassify,
				'title' : $scope.createTitle,
				'content' : $('#createContent').val()
			});
			Notice.createNotice(data).success(function(ret) {
				console.log(ret);
				alert('등록이 완료되었습니다.');
				$state.go('user.notice-list');
			});	
		};

		
		$scope.deleteNotice = function(id) {
			if(!confirm("정말로 삭제하시겠습니까?")) return;
			Notice.deleteNotice(id).success(function(ret) {
				console.log(ret);
				alert('삭제가 완료되었습니다.');
				return $timeout(function () {
					$state.go('.', {}, { reload: true });
				}, 100);
			});
		};

		$scope.showStatus = function(data) {
			var statusList = {
				"WAIT":"노출대기",
				"FREE":"무료노출",
				"BASIC":"유료노출",
				"PREMIUM":"유료노출",
				"VIP":"유료노출"
			};
			return statusList[data];
		};
    });
