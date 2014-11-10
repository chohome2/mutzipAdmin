'use strict';

angular.module('mutzipAdminApp')
    .controller('AdminrecommendCtrl', function ($scope, $rootScope, $http,$timeout, Auth, Shop) {
        $scope.isAdmin = Auth.isAdmin();
		$scope.shopList = [];
		$scope.carouselIndex = 0;
		Shop.getUserShopList(Auth.user.id).success(function (ret) {
			console.log(ret);
			$scope.shopList = ret.data;
		});
		
		$scope.selectShop = function() {
			console.log($scope.selectedShop);
			$http.get('/api/shop/' + $scope.selectedShop.shop_id + '/recommend/').success(function(ret) {
				console.log(ret);
				if(ret.image_list.length == 0) {
					alert('현재 등록된 스타일컷이 없는 관계로 추천이미지를 확인할 수 없습니다.');
					$scope.shopData = null;
					return;
				}
				$scope.carouselIndex = 0;
				$scope.shopData = ret;
				$scope.recommendData = ret.image_list[0].recommend_list;
			});
		}
		
		$scope.$watch("carouselIndex",function() {
			console.log($scope.carouselIndex);
			if($scope.shopData) $scope.recommendData = $scope.shopData.image_list[$scope.carouselIndex].recommend_list;
		});
		
		$scope.getButtonClassName = function(shop) {
			if(($scope.isAdmin && shop.status4a) || (!$scope.isAdmin && shop.status4u)) {
				return "btn-danger";
			}
			return "btn-default";
		};
		$scope.groupText = function(image) {
			//TODO 3단계용 로직임, 추후 4단계 변경시 제거필수
		    //return "Group" + (parseInt(image.style,2) + 1);
			if(image.style == '') return "Style 없음";
			var style = image.style + '';
		    return "Group" + (parseInt(style.substring(0,3),2) + 1);
		};

		$scope.clickShop = function(shop) {
			console.log(shop.shop_id);
			$rootScope.recentShop = shop;
		}

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
