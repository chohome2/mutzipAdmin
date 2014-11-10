'use strict';

angular.module('mutzipAdminApp')
    .factory('Owner', function($http, $cookies){
        return {
            getOwnerList: function() {
                return $http.get('/admin/owner/');
			},
			getOwner: function(id) {
				return $http.get('admin/owner/' + id);
			},
			createOwner: function(data) {
				return $http.post('/admin/owner/?action=create',data);
			},
			deleteOwner: function(id) {
				return $http.post('/admin/owner/' + id + '/?action=delete');
			},
			resetOwnerPassword: function(id) {
				return $http.post('/admin/owner/' + id + '/?action=update&reset=1');
			},
			updateOwnerBeforeLogin: function(data) {
				return $http.post('/admin/owner/?action=update',data);
			},
			updateOwner: function(data,id) {
				return $http.post('/admin/owner/' + id + '/?action=update',data);
			}
		}
    });
