'use strict';

angular.module('mutzipAdminApp')
    .controller('ShopstylecutCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, Auth, Shop) {
		var userId = Auth.user.id;
		
		$scope.isAdmin = Auth.isAdmin();
		$scope.shopId = $stateParams.shopId;
		$scope.imageList = [];
		$scope.uploadFile = function(){
        	var file = $scope.myFile;
        	console.log('file is ' + JSON.stringify(file));
			if(file == undefined) {
				alert('등록할 이미지를 선택해 주세요.');
				return;
			}

			var validCount = 0;
			var size = $scope.imageList.length;
            var minIndex = -1;
            for(var i = 0; i < size; i++) {
                if($scope.imageList[i].image_id == "") {
                    validCount++;
				}
            }
            if(validCount < file.length) {
                if(!confirm('현재 비어있는 슬롯의 수(' + validCount + '개)가 등록할 이미지수(' + file.length+ '개)보다 적습니다. ' + validCount + '개의 이미지만 등록하시겠습니까?'))
                	return;
            }
			validCount = validCount > file.length ? file.length : validCount;			
	
			var totalCount = 0;
			for(var idx = 0; idx < validCount; idx++) {
				var size = $scope.imageList.length;
				var minIndex = -1;
				for(var i = 0; i < size; i++) {
					if($scope.imageList[i].image_id == "") {
						minIndex = i + 1;
						$scope.imageList[i].image_id = "ok";
						break;
					}
				}
				/*
				if(minIndex == -1) {
					alert('비어있는 슬롯이 없어 새로운 이미지를 등록할 수 없습니다. 이미지 삭제 후 다시 등록해 주세요.');
					return;
				}*/
				
        		Shop.uploadImage(file[idx], $scope.shopId, minIndex).success(function(ret){
					console.log(ret);
					if(ret.status == 'success') {
						console.log(++totalCount + "th image upload finished!!");
						if(totalCount == validCount) {
							alert('이미지 등록이 완료되었습니다.');
							$state.go('user.shop-stylecut',{'shopId':$scope.shopId});
						}
					}
					else {
						alert('이미지 등록에 실패했습니다.');
					}
				});
			}
    	};

		$scope.deleteFile = function(id) {
			console.log(id);
			Shop.deleteImage($scope.shopId, id).success(function(ret) {
				if(ret.status == 'success') {
					alert('삭제가 완료되었습니다.');
					return $timeout(function () {
						$state.go('.', {}, { reload: true });
					}, 100);
				}
				else {
					alert('삭제가 실패하였습니다. 다시 시도해 주세요.');
				}
			});
		}
		
		$scope.modifyOrder = function() {
			var images = [];
			var size = $scope.imageList.length;
			for(var i = 0; i < size; i++) {
				if($scope.imageList[i].image_id) {
					images.push({'image_id':$scope.imageList[i].image_id, 'order':i+1});
				}
			}
			console.log(images);
			Shop.modifyOrder($scope.shopId, {"images":images}).success(function(ret) {
				if(ret.status == 'success') {
					alert('순서 변경이 완료되었습니다.');
					$state.go('user.shop-stylecut',{'shopId':$scope.shopId});
				}
				else {
					alert('순서 변경 중 에러가 발생하였습니다. 다시 시도해 주세요.');
				}
			});
		};

		$scope.updateImageStatus = function(id, status) {
			Shop.updateImageStatus($scope.shopId, id, jQuery.param({'status':status})).success(function(ret) {
				console.log(ret);
				/*
				alert('스타일컷 상태변경이 완료되었습니다.');
				return $timeout(function () {
					$state.go('.', {}, { reload: true });
				}, 100);
				*/
				$scope.getImageList();
			});
		};

		Shop.getShop($stateParams.ownerId, $scope.shopId).success(function (ret) {
			$scope.shopInfo = ret.data[0];
		});
		$scope.getImageList = function() {
		Shop.getImageList($scope.shopId).success(function (ret) {
			console.log(ret);
			$scope.refer = ret.refer;
			for(var i = 1; i <= $scope.refer.grade.dp_desc; i++) {
				$scope.imageList.push({order:i,image_id:""});
			}
			for(var i = 0; i < ret.data.length; i++) {
				if(ret.data[i].order <= $scope.refer.grade.dp_desc) {
					$scope.imageList[ret.data[i].order - 1] = ret.data[i];
				}
			}
			console.log($scope.imageList);
			//$scope.imageList = ret.data;
			$timeout(function () {
				$(".alerts").popover({html:true});
				$(".sortable").sortable().bind('sortupdate',function() {
					var tempList = [];
					$.each($('.sortable li div h1'),function(index,value) {
						tempList.push($scope.imageList[value.innerHTML-1]);
					});
					$scope.imageList = tempList;
					console.log($scope.imageList);
					$scope.$digest();
				});
			}, 1000);
		});
		};

		$scope.getImageList();

		Shop.getStyleQuestion().success(function(ret) {
			console.log(ret.data.query);
			$scope.styleQuestion = ret.data.query;
		});


		$scope.styleDataCounter = [0,1,2];
		$scope.openStyleEditor = function(image) {
			console.log(image);
			//$scope.selectedImage = image;
			$scope.selectedImage = $.extend(true,{},image);
			$scope.makeStyleData($scope.selectedImage);
			$('#styleQuestionModal').modal();	
		};

		$scope.changeStyle = function(index) {
			console.log(index);
			var styleString = "";
			for(var i = 0 ; i <= index ; i++) {
				styleString += $scope.styleData[i].a;
			}
			console.log(styleString);
			$scope.selectedImage.style = styleString;
			$scope.makeStyleData($scope.selectedImage);
		}

		$scope.groupText = function(image) {
			//return "Group" + (parseInt(image.style,2) + 1);
			//TODO 3단계용 로직임
			var style = image.style + '';
			return "Group" + (parseInt(style.substring(0,3),2) + 1);
		};

		$scope.makeStyleData = function(image) {
			var styleData = [$scope.styleQuestion[0]];
			var len = image.style.length;
			var styleString = "1";
			for(var i = 0; i < len ; i++) {
				var answer = image.style.charAt(i);
				styleString += answer;
				console.log(styleString);
				styleData[i].a = answer;

				if($scope.styleQuestion[parseInt(styleString,2) - 1]) {
					styleData[i+1] = $scope.styleQuestion[parseInt(styleString,2) - 1];
					styleData[i+1].a = "";
				}
			}
			$scope.styleData = styleData;
			console.log($scope.styleData);
			console.log($scope.styleQuestion);
		};
		$scope.saveStyle = function() {
			console.log("save");
			var styleString = "";
			for(var i = 0; i < $scope.styleDataCounter.length ; i++) {
				if($scope.styleData[i].a == "0" || $scope.styleData[i].a == "1") {
					styleString += $scope.styleData[i].a;
				}
				else {
					alert("모든 질문에 답변해 주세요.");
					return;
				}
			}
			//TODO 강제로 4단계답변으로 맞추는 코드임. 추후 4단계 변경후엔 필히 바꿔야함
			styleString += '0';
			console.log(styleString);
			Shop.updateImageStatus($scope.shopId, $scope.selectedImage.image_id, jQuery.param({'style':styleString})).success(function(ret) {
				console.log(ret);
				alert("스타일 설정이 완료되었습니다.");
				return $timeout(function () {
	            	$state.go('.', {}, { reload: true });
				}, 100);
			});
		};

		$scope.getPopoverTitle = function(status) {
			var data = {
				'EXPIRE' : '기간경과',
				'WAIT' : '관리자 승인대기 중',
				'REJECT' : '반려'
			};
			return data[status];
		};
		$scope.getPopoverContent = function(status) {
			var data = {
				'EXPIRE' : ' - 등록한지 30일이 경과한 이미지는 상세페이지에만 노출되고, 메인페이지에는 노출되지 않습니다.<br> - 이미지등록/편집버튼을 눌러 다른 이미지가 메인페이지에 노출될 수 있도록 순서를 수정해 주세요.',
				'WAIT' : ' - 승인완료 후, 메인페이지에 노출됩니다.',
				'REJECT' : ' - 해당 이미지는 상세페이지에만 노출되고 메인페이지에는 노출되지 않습니다.<br> - 이미지 등록/편집버튼을 눌러 다른 이미지가 메인페이지에 노출될 수 있도록 순서를 수정해 주세요.<br> - 반려사유는 관리자에게 문의해 주세요.'
			};
			return data[status];
		};

    }).directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    //modelSetter(scope, element[0].files[0]);
                    modelSetter(scope, element[0].files);
                });
            });
        }
      };
	}]);
