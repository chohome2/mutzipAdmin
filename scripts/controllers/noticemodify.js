'use strict';

angular.module('mutzipAdminApp')
    .controller('NoticemodifyCtrl', function ($scope, $state, $rootScope, $stateParams, Auth, Notice) {
        $scope.isAdmin = Auth.isAdmin();
		$("#createContent").wysihtml5();
	
		var editor = $("#createContent").data("wysihtml5").editor;
		Notice.getNotice($stateParams.noticeId).success(function(ret) {
			console.log(ret);
			editor.setValue(ret.data[0].content);
			$scope.modifyNotice = ret.data[0];
		});

		$scope.modify = function() {
			if(!$scope.modifyNotice.title || $scope.modifyNotice.title.trim().length == 0) {
                $rootScope.error = '제목을 입력해 주세요';
                return;
            }
            if(!$('#createContent').val() || $('#createContent').val().trim().length == 0) {
                $rootScope.error = '본문을 입력해 주세요';
                return;
            }
            var data = jQuery.param({
                'type' : $scope.modifyNotice.type,
                'title' : $scope.modifyNotice.title,
                'content' : $('#createContent').val()
            });
            Notice.updateNotice($stateParams.noticeId,data).success(function(ret) {
            	alert('수정이 완료되었습니다.');
				$state.go('user.notice-list');
			});
        };	
	});
