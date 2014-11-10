'use strict';

angular.module('mutzipAdminApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $state, Auth, Owner) {
        $('#loginModal').modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });

        $scope.isShowForgotPassword = false;
        $scope.toggleForgotPassword = function() {
            $scope.isShowForgotPassword = !$scope.isShowForgotPassword;
        };
		$scope.resetPasswordInfo = {};
        $scope.login = function() {
            Auth.login({
                    username: $scope.username,
                    password: $scope.password
                },
                function(res) {
                    $state.go('user.shop-list');
                },
                function(err) {
                    $rootScope.error = "Failed to login";
                });
        };

        $scope.resetPassword = function() {
			$("#spinnerModal").modal({'backdrop':'static','keyboard':false});	
			Owner.updateOwnerBeforeLogin(jQuery.param($scope.resetPasswordInfo)).success(function(ret) {
				console.log(ret);
				$("#spinnerModal").modal('hide');
				if(ret.status == 'success') {
					alert('초기화 된 비밀번호가 해당 이메일로 전송되었습니다.');
				} else {
					$rootScope.error = '존재하지 않는 계정입니다. 정확한 계정 정보를 입력해 주세요.';
				}
			});
		};
    });
