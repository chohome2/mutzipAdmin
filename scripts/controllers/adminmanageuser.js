'use strict';

angular.module('mutzipAdminApp')
	.controller('AdminmanageuserCtrl', function ($scope,$rootScope,$stateParams,Auth,Owner,$state,$timeout) {
		$scope.ownerList = [];
		$scope.createId;
		$scope.createMobile;
		Owner.getOwnerList().success(function (ret) {
			$scope.ownerList = ret.data;
			console.log(ret.data);
			$timeout(function () {
                    $('#owner-list-table').dataTable({
                    });
                }, 100);
		});
		console.log(Auth.user);
		Owner.getOwner(Auth.user.id).success(function(ret) {
			$scope.updateData = {mobile:ret.data[0].mobile,passwd:"",newPasswd:"",confirmPasswd:""};
		});
		$scope.updateOwner = function() {
			var data = {};
			
			if($scope.updateData.passwd.length == 0 && $scope.updateData.newPasswd.length == 0 && $scope.updateData.confirmPasswd.length == 0) {
			}
			else if($scope.updateData.passwd.length == 0) {
				alert('기존 비밀번호를 입력해 주세요.');
				return;
			}
			else if($scope.updateData.newPasswd.length == 0) {
				alert('변경할 비밀번호를 입력해 주세요.');
				return;
			}
			else if($scope.updateData.newPasswd == $scope.updateData.confirmPasswd) {
				data['new_passwd'] = $scope.updateData.newPasswd;
				data['passwd'] = $scope.updateData.passwd;
			}
			else {
				alert('변경할 비밀번호가 서로 일치하지 않습니다. 같은 비밀번호를 입력하세요.');
				return;
			}

			 
			
			if($scope.updateData.mobile.length > 0) {
				data['mobile'] = $scope.updateData.mobile;
			}
			if(Object.keys(data).length == 0) {
				alert("변경할 정보를 입력해 주세요.");
			}
			//data['owner_id'] = Auth.user.id;
			
			Owner.updateOwner(jQuery.param(data), Auth.user.id).success(function(ret) {
				console.log(ret);
				if(ret.status == 'failure') {
					alert('현재 비밀번호가 일치하지 않습니다.');	
				}
				else { 
					alert('회원정보변경이 완료되었습니다');	
				}
			});
		};

		$scope.create = function() {
			$("#spinnerModal").modal({'backdrop':'static','keyboard':false});
			Owner.createOwner(jQuery.param(
				{
					email:$scope.createId,
					mobile:$scope.createMobile
				}
			)).success(function(ret){
				console.log(ret);
				$("#spinnerModal").modal('hide');
				if(ret.status == 'success') {
					alert('회원 등록이 완료되었습니다.');
					$state.go('admin.manage-user');
				}
				else {
					$rootScope.error = ret.data.error;
				}
			});
		};

		if($stateParams.ownerId) {
			Owner.getOwner($stateParams.ownerId).success(function(ret) {
			    $scope.updateDataByAdmin = {mobile:ret.data[0].mobile};
			});
		}
		$scope.updateOwnerByAdmin = function() {
			console.log($scope.updateDataByAdmin);
			Owner.updateOwner(jQuery.param({"mobile":$scope.updateDataByAdmin.mobile}), $stateParams.ownerId).success(function(ret) {
				console.log(ret);
				alert('정보수정이 완료되었습니다.');
				$state.go('admin.manage-user');
			});
		};

		$scope.delete = function(id) {
			if(confirm("선택하신 회원의 계정을 삭제하시겠습니까?")) {
				Owner.deleteOwner(id).success(function(ret){
					if(ret.status == 'success') {
						return $timeout(function () {
							$state.go('.', {}, { reload: true });
						}, 100);
					}
					else {
						alert(ret.data.error);
					}
				});
			}
		}
		$scope.resetAdminPassword = function(id) {
			$("#spinnerModal").modal({'backdrop':'static','keyboard':false});
			Owner.resetOwnerPassword(id).success(function(ret){
				console.log(ret);
				$("#spinnerModal").modal('hide');
				alert('비밀번호 초기화가 완료되었습니다.');
			}).error(function(){
				$("#spinnerModal").modal('hide');
				alert('비밀번호 초기화가 실패하였습니다.');
				});
		};
	});
