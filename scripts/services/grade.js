'use strict';

angular.module('mutzipAdminApp')
    .factory('Grade', function($http){
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        return {
            getGrade: function(grade) {
                return $http.get('/admin/info/grade/' + grade + '/');
			},
			updateGrade: function(grade,data) {
				return $http.post('/admin/info/grade/' + grade + '/?action=update',data);
			},
			getPayment: function(shopId) {
				return $http.get('/admin/shop/' + shopId + '/payment/');
			},
			createPayment: function(shopId,data) {
				return $http.post('/admin/shop/' + shopId + '/payment/?action=create',data);
			}, 
			modifyPayment: function(shopId,paymentId,data) {
				return $http.post('/admin/shop/' + shopId + '/payment/' + paymentId + '/?action=update',data);
			},
			deletePayment: function(shopId,paymentId) {
		    	return $http.post('/admin/shop/' + shopId + '/payment/' + paymentId + '/?action=delete');
			},

		}
    });
