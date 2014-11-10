'use strict';

angular.module('mutzipAdminApp')
    .factory('Notice', function($http){
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		return {
            getNotice: function(id) {
                return $http.get('/admin/info/notice/' + id + '/');
			},
			getNoticeList: function() {
                return $http.get('/admin/info/notice/');
			},
			createNotice: function(data) {
				return $http.post('/admin/info/notice/?action=create',data);
			},
			deleteNotice: function(id) {
				return $http.post('/admin/info/notice/' + id + '/?action=delete');
			},
			updateNotice: function(id,data) {
				return $http.post('/admin/info/notice/' + id + '/?action=update',data);
			}

		}
    });
