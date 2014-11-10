'use strict';

angular.module('mutzipAdminApp')
	.controller('AdminmanageareaCtrl', function ($scope,Area,$timeout,$state) {
		$scope.areaList = [];
		$scope.createName;
		Area.getAreaList().success(function (ret) {
			console.log(ret.data);
			$scope.areaList = ret.data;
		});

		$scope.create = function() {
		console.log($scope.createName);	
		Area.createArea(jQuery.param(
				{
					name:$scope.createName
				}
			)).success(function (ret) {
				console.log(ret);
				if(ret.status == 'success') {
					return $timeout(function () {
						$state.go('.', {}, { reload: true });
					}, 100);
				}
				else {
					alert(ret.data.error);
				}
			});
		};
		$scope.changeName = function(area) {
			$scope.modalArea = area;
			$('#areaModal').modal();
		};
		$scope.changeArea = function() {
			console.log($scope.modalArea);
			Area.updateArea($scope.modalArea.poi_id,jQuery.param({'name':$scope.modalArea.name})).success(function(ret) {
				console.log(ret);
				if(ret.status == 'success') {
					alert('지역명 변경이 완료되었습니다.');
				}
				else {
					alert(ret.data.error);
					return $timeout(function () {
						$state.go('.', {}, { reload: true });	
					},100);

				}
			});
			$('#areaModal').modal('hide');
		}
	});
