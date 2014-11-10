'use strict';

angular.module('mutzipAdminApp')
    .factory('Shop', function($http){
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		return {
			getShop: function(ownerId,shopId) {
                return $http.get('/admin/owner/' + ownerId + '/shop/' + shopId + '/');
			},          
			getAdminShopList: function(id) {
                return $http.get('/admin/search/shop/');
			},
			getUserShopList: function(id) {
                return $http.get('/admin/owner/' + id + '/shop/');
			},
			createOwner: function(data) {
				return $http.post('/admin/owner/?action=create',data);
			},
			createShop: function(ownerId, data) {
				return $http.post('/admin/owner/' + ownerId + '/shop/?action=create',data);
			},
			modifyShop: function(ownerId, shopId, data) {
                return $http.post('/admin/owner/' + ownerId + '/shop/' + shopId + '/?action=update',data);
			},
			deleteOwner: function(id) {
				return $http.post('/admin/owner/' + id + '/?action=delete');
			},
			uploadImage: function(file,shopId,order) {
				var fd = new FormData();
				fd.append('image_url', file);
				fd.append('order', order);
				fd.append('likes', 0);
				fd.append('style', '');
				fd.append('status', 'WAIT');
				return $http.post('/admin/shop/' + shopId + '/image/?action=create', fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				});
			},
			updateShopImage: function(file,ownerId,shopId,type) {
				var fd = new FormData();
				fd.append(type, file);
				return $http.post('/admin/owner/' + ownerId + '/shop/' + shopId + '/?action=update', fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				});
			},
			deleteImage: function(shopId,imageId) {
				return $http.post('/admin/shop/' + shopId + '/image/' + imageId + '/?action=delete');
			},
			updateImageStatus: function(shopId,imageId,data) {
				return $http.post('/admin/shop/' + shopId + '/image/' + imageId + '/?action=update',data);
			},
			modifyOrder: function(shopId, data) {
				return $http.post('/admin/shop/' + shopId + '/image/order/', data, {'headers':{'Content-Type':'application/json'}});
			},
			getImageList: function(id) {
                return $http.get('/admin/shop/' + id + '/image/');
			},
			getStyleQuestion: function() {
				return $http.get('/admin/info/style/');
			}
		}
    });
