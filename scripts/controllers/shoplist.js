'use strict';

angular.module('mutzipAdminApp')
    .controller('ShoplistCtrl', function ($scope, $rootScope, $timeout, Auth, Shop) {
		$scope.isAdmin = Auth.isAdmin();
		$scope.shopList = [];
		//if(Auth.isAdmin()) {
		//if(0) {
			Shop.getUserShopList(Auth.user.id).success(function (ret) {
				console.log(ret);
				$scope.shopList = ret.data;
				$timeout(function () {
					$('#shop-list-table').dataTable({
					});
				}, 100);
			});
		/*}
		else {
			Shop.getUserShopList(Auth.user.id).success(function (ret) {
				console.log(ret);
				$scope.shopList = ret.data;
			});
		}*/
		$scope.getButtonClassName = function(shop) {
			if(($scope.isAdmin && shop.status4a) || (!$scope.isAdmin && shop.status4u)) {
				return "btn-danger";
			}
			return "btn-default";
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
