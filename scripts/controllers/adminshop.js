'use strict';

angular.module('mutzipAdminApp')
	.controller('AdminshopCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, $http, Area, Shop, Auth, Grade) {
  		$scope.isAdmin = Auth.isAdmin();
		//$scope.shop = $rootScope.recentShop;
		Shop.getShop($stateParams.ownerId, $stateParams.shopId).success(function(ret) {
			console.log(ret);
			$scope.shop = ret.data[0];
		});
		$scope.createShop = {};
		$scope.additionalShop = {};
		Area.getAreaList().success(function(ret){
			$scope.areaList = ret.data;
		});
		$scope.updateAdmin = function() {
			console.log($scope.updateAdminEmail);
			var postData = {};
			if($scope.updateAdminEmail == undefined) postData['email'] = "feelitmutzip@gmail.com";
			else postData['email'] = $scope.updateAdminEmail;
			$http.post('/admin/shop/' + $scope.shop.shop_id + '/owner/?action=update', jQuery.param(postData)).success(function(ret) {
				console.log(ret);
				if(ret.status == 'failure') {
					alert('존재하지 않는 이메일입니다.');
				}
				else {
					alert('매장관리자가 변경되었습니다.');
					$state.go('user.shop-list');
				}
			});
		};

		$scope.create = function() {
			//console.log($scope.createShop);
			
			if($scope.createShop.name_main == undefined || $scope.createShop.name_main.trim().length == 0) {
				alert('매장 이름을 입력하세요.');
				return;
			}
			if($scope.createShop.description == undefined || $scope.createShop.description.trim().length == 0) {
				alert('상세페이지 노출용 매장이름을 입력하세요.');
				return;
			}
			if($scope.createShop.phone_repr == undefined || $scope.createShop.phone_repr.trim().length == 0) {
				alert('대표전화번호를 입력하세요.');
				return;
			}
			if($scope.createShop.address == undefined || $scope.createShop.address.trim().length == 0) {
				alert('주소를 입력하세요.');
				return;
			}
			if($scope.additionalShop.poi == undefined) {
				alert('지역을 입력하세요.');
				return;
			}
			$scope.createShop.poi = $scope.additionalShop.poi.name;
	
			var phoneEtc = "";
			if($scope.additionalShop.phone1 != undefined && $scope.additionalShop.phone1.trim().length > 0) {
				phoneEtc += $scope.additionalShop.phone1.trim() + ",";
			}
			if($scope.additionalShop.phone2 != undefined && $scope.additionalShop.phone2.trim().length > 0) {
				phoneEtc += $scope.additionalShop.phone2.trim() + ",";
			}
			if($scope.additionalShop.phone3 != undefined && $scope.additionalShop.phone3.trim().length > 0) {
				phoneEtc += $scope.additionalShop.phone3.trim() + ",";
			}
			if(phoneEtc.length > 0) {
				phoneEtc = phoneEtc.substr(0,phoneEtc.length - 1);
				$scope.createShop.phone_etc = phoneEtc;
			}

			$http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.createShop.address) + '&sensor=false')
				.success(function(ret) {
					console.log(ret);
					if(ret.status != 'OK') {
						alert('해당 주소에 대한 위치를 찾을 수 없습니다. 정확한 주소를 입력하세요.');
						return;
					}
					console.log(ret.results[0].geometry.location.lat);
					$scope.createShop.location = ret.results[0].geometry.location.lng + "," + ret.results[0].geometry.location.lat;
					console.log($scope.createShop);
					Shop.createShop(Auth.user.id, jQuery.param($scope.createShop)).success(function(ret) {
							console.log(ret);
							if(ret.status == 'success') {
								alert('매장등록이 완료되었습니다.');
								$state.go('user.shop-list');
							}
							else {
								if(ret.data.code == '150') {
									alert('홈페이지 주소가 url형식이 아닙니다. (예시 : http://www.naver.com)');
								}
								else 
									alert('매장등록이 실패하였습니다. 잠시 후 다시 시도해 주세요.');
							}
						});
				});

			//Shop.createShop(Auth.user.id, jQuery.param({'name_main':'메인매장명111', 'name_sub':'서브매장명222', 'description':'앱노출매장명', 'phone_repr':'010-1111-2222', 'phone_etc':'02-1111-1111,02-2222-2222,02-3333-3333', 'address':'운중동 1029', 'location':'127.518581,37.462522','poi':'홍대'})).success(function(ret) {console.log(ret);});
		};
		$scope.checkMapPosition = function() {
			if($scope.createShop.address == undefined || $scope.createShop.address.trim().length == 0) {
				alert('주소를 입력하세요.');
				return;
			}
			$http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.createShop.address) + '&sensor=false')
				.success(function(ret) {
					console.log(ret);
					if(ret.status != 'OK') {
						alert('해당 주소에 대한 위치를 찾을 수 없습니다. 정확한 주소를 입력하세요.');
						return;
					}
					$('#mapModal').modal();
					$("#mapModal").on("shown.bs.modal",function(){
						var myLatlng = new google.maps.LatLng(ret.results[0].geometry.location.lat, ret.results[0].geometry.location.lng);
						var mapOptions = {
							center: myLatlng,
							zoom: 16,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};
						var map = new google.maps.Map(document.getElementById("mapShopPosition"),mapOptions);
						var marker = new google.maps.Marker({
							    position: myLatlng,
								    title:"shop"
									});

						// To add the marker to the map, call setMap();
						marker.setMap(map);
					});
					console.log(ret.results[0].geometry.location.lat);
				});
		};

		Grade.getPayment($stateParams.shopId).success(function(ret) {
			console.log(ret);
			$scope.paymentList = ret.data;
		});

		$scope.createPaymentData = {"cost_type":"PURCHASE", "grade":"BASIC"};

		$scope.manageCreatePayment = function() {
			$("#paymentCreateModal").modal();
		};
		$scope.createPayment = function() {
			console.log($scope.createPaymentData);
			Grade.createPayment($scope.shop.shop_id, jQuery.param($scope.createPaymentData)).success(function(ret) {
					console.log(ret);
					if(ret.status == 'success') {
						alert('상품등록이 완료되었습니다');
						$("#paymentCreateModal").modal('hide');
						return $timeout(function () {
                    		$state.go('.', {}, { reload: true });
					    }, 100);
					}
					else {
						$rootScope.error = ret.data.error;
					}
				});
		};
		$scope.modifyPayment = function(payment) {
			$scope.modifyPaymentData = {};
			$scope.modifyPaymentData['start'] = payment.start;
			$scope.modifyPaymentData['end'] = payment.end;
			$scope.modifyPaymentData['cost_type'] = payment.cost_type;
			$scope.modifyPaymentData['cost'] = payment.cost;
			$scope.modifyPaymentData['grade'] = payment.grade;
			$scope.modifyPaymentId = payment.payment_id;
			$("#paymentModifyModal").modal();
		};
		$scope.modifyPaymentConfirm = function() {
			Grade.modifyPayment($scope.shop.shop_id,$scope.modifyPaymentId,jQuery.param($scope.modifyPaymentData)).success(function(ret) {
				console.log(ret);
				if(ret.status == 'success') {
                    alert('상품수정이 완료되었습니다');
                    $("#paymentCreateModal").modal('hide');
     	            return $timeout(function () {
 	                    $state.go('.', {}, { reload: true });
                    }, 100);
                }
                else {
                    $rootScope.error = ret.data.error;
                }
			});
		};

		$scope.deletePayment = function(paymentId) {
			if(!confirm('정말로 삭제하시겠습니까?')) return;
			Grade.deletePayment($scope.shop.shop_id,paymentId).success(function(ret) {
				console.log(ret);
				return $timeout(function () {
					$state.go('.', {}, { reload: true });
				}, 100);
			});
		}
	})
	.filter('dateFormat', function() {
    	return function(input) {
			input = input + '';
      		return input.substr(0,4) + '-' + input.substr(4,2) + '-' + input.substr(6,2);
    	};
  	})
	.filter('gradeString', function() {
        return function(input) {
            if(input == 'PURCHASE') return '정상구매';
			return '프로모션';
        };
    });
