'use strict';

angular.module('mutzipAdminApp')
	.controller('AdminmanageproductCtrl', function ($scope,Grade) {
  		$scope.grade = {};
		Grade.getGrade('wait').success(function(ret) {
            console.log(ret);
            $scope.grade.wait = ret.data[0];
        }); 
		Grade.getGrade('free').success(function(ret) {
            console.log(ret);
            $scope.grade.free = ret.data[0];
        }); 
		Grade.getGrade('basic').success(function(ret) {
			console.log(ret);
			$scope.grade.basic = ret.data[0];
		});
		Grade.getGrade('premium').success(function(ret) {
			$scope.grade.premium = ret.data[0];
		});
		Grade.getGrade('vip').success(function(ret) {
			$scope.grade.vip = ret.data[0];
		});
		$scope.changeValue = function(grade) {
			$scope.gradeName = grade;
			$scope.changeGrade = $scope.grade[grade];
			$('#gradeModal').modal();
		};
		$scope.change = function() {
			Grade.updateGrade($scope.gradeName,jQuery.param({'id':$scope.changeGrade.grade_id,'dp_main':$scope.changeGrade.dp_main,'dp_desc':$scope.changeGrade.dp_desc,'price':$scope.changeGrade.price})).success(function(ret){
				console.log(ret);
				$('#gradeModal').modal('hide');
				alert('상품정보 변경이 완료되었습니다.');
			});
		}

});
