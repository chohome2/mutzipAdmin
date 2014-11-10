'use strict';

angular.module('mutzipAdminApp')
    .factory('Area', function($http){
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        return {
            getAreaList: function() {
                return $http.get('/admin/info/poi/');
			},
			createArea: function(data) {
				return $http.post('/admin/info/poi/?action=create',data);
			},
			updateArea: function(id,data) {
				return $http.post('/admin/info/poi/' + id + '/?action=update',data);
			}

		}
    });
