'use strict';

angular.module('mutzipAdminApp')
    .controller('ShopinfoCtrl', function ($scope, $rootScope, $stateParams, $state, $timeout, $http, Auth, Shop, Area) {
		var userId = Auth.user.id;
		
		$scope.additionalShop = {};
		Shop.getShop($stateParams.ownerId, $stateParams.shopId).success(function(ret) {
				console.log(ret);
				$scope.shop = ret.data[0];
				if($scope.shop.hasOwnProperty('phone_etc')) {
				angular.forEach($scope.shop.phone_etc, function(value, key) {
					if(key == 0) {
						$scope.additionalShop.phone1 = value;
					} else if(key == 1) {
						$scope.additionalShop.phone2 = value;
					} else if(key == 2) {
						$scope.additionalShop.phone3 = value;
					}
				});}
				Area.getAreaList().success(function(ret){
				    console.log(ret);
					$scope.areaList = ret.data;
					angular.forEach($scope.areaList, function(value, key) {
						if(value.name == $scope.shop.poi) {
							$scope.additionalShop.poi = value;
							return;
						}
					});
				});
			});

		$(".alerts").popover({html:true});

		$scope.modifyShop = function() {
            if($scope.shop.name_main == undefined || $scope.shop.name_main.trim().length == 0) {
                alert('매장 이름을 입력하세요.');
                return;
            }
            if($scope.shop.description == undefined || $scope.shop.description.trim().length == 0) {
                alert('상세페이지 노출용 매장이름을 입력하세요.');
                return;
            }  
            if($scope.shop.phone_repr == undefined || $scope.shop.phone_repr.trim().length == 0) {
                alert('대표전화번호를 입력하세요.');
                return;
            }  
            if($scope.shop.address == undefined || $scope.shop.address.trim().length == 0) {
                alert('주소를 입력하세요.');
                return;
            }  
            if($scope.additionalShop.poi == undefined) {
                alert('지역을 입력하세요.');
                return;
            }  
            $scope.shop.poi = $scope.additionalShop.poi.name;
   
            var phoneEtc = "";
			$scope.shop.phone_etc = phoneEtc;
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
                $scope.shop.phone_etc = phoneEtc;
            }
			$http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.shop.address) + '&sensor=false')
                .success(function(ret) {
                    console.log(ret);
                    if(ret.status != 'OK') {
                        alert('해당 주소에 대한 위치를 찾을 수 없습니다. 정확한 주소를 입력하세요.');
                        return;
                    }
                    console.log(ret.results[0].geometry.location.lat);
                    $scope.shop.location = ret.results[0].geometry.location.lng + "," + ret.results[0].geometry.location.lat;
                    console.log($scope.shop);
					var updateData = {};
					updateData["name_main"] = $scope.shop.name_main;
					updateData["name_sub"] = $scope.shop.name_sub;
					updateData["description"] = $scope.shop.description;
					updateData["phone_repr"] = $scope.shop.phone_repr;
					updateData["phone_etc"] = $scope.shop.phone_etc;
					updateData["address"] = $scope.shop.address;
					updateData["location"] = $scope.shop.location;
					updateData["work_time"] = $scope.shop.work_time;
					updateData["poi"] = $scope.shop.poi;
					updateData["url"] = $scope.shop.url;
                    console.log(updateData);
					Shop.modifyShop($stateParams.ownerId, $scope.shop.shop_id, jQuery.param(updateData)).success(function(ret) {
                            console.log(ret);
							if(ret.status == 'success') {
								alert("매장정보가 변경되었습니다.");
								$state.go('user.shop-info',{'ownerId':$stateParams.ownerId,'shopId':$scope.shop.shop_id});
							}
							else {
								if(ret.data.code == '150') {
                                    alert('홈페이지 주소가 url형식이 아닙니다. (예시 : http://www.naver.com)');
                                }
                                else
                                    alert('매장정보수정이 실패하였습니다. 잠시 후 다시 시도해 주세요.');	
							}
                        });
                });
        };

		$scope.checkMapPosition = function() {
            if($scope.shop.address == undefined || $scope.shop.address.trim().length == 0) {
                alert('주소를 입력하세요.');
                return;
            }  
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent($scope.shop.address) + '&sensor=false')
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

		$scope.images = [];
        $scope.updateImage = function(type) {
            if($scope.images[type] == undefined) {
                alert("파일을 선택해 주세요.");
                return;
            }
            console.log($scope.images[type]);
            Shop.updateShopImage($scope.images[type][0], $stateParams.ownerId, $stateParams.shopId, type).success(function(ret) {
                console.log(ret);
                if(ret.status == 'success') {
                    alert('이미지가 성공적으로 등록되었습니다.');
                    window.location.reload();
                }
                else if(ret.data.code == '160') {
                    alert('잘못된 해상도의 이미지입니다. 올바른 해상도의 이미지를 선택해 주세요.');
                }
				else {
					alert('이미지 등록이 실패하였습니다. 올바른 파일을 선택해 주세요');
				}
            });
        };
    });
