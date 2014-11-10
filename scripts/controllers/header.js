'use strict';

angular.module('mutzipAdminApp')
    .controller('HeaderCtrl', function ($scope,$state,Auth) {
		console.log("header!!!");
		$scope.user = Auth.user;
        $scope.logout = function() {
            Auth.logout(function() {
                $state.go('anon.login');
            }, function() {
                $rootScope.error = "Failed to logout";
            });
        };
		$("[data-toggle='offcanvas']").click(function(e) {
        	e.preventDefault();
        	if ($(window).width() <= 992) {
            	$('.row-offcanvas').toggleClass('active');
          	  	$('.left-side').removeClass("collapse-left");
           		$(".right-side").removeClass("strech");
            	$('.row-offcanvas').toggleClass("relative");
       		} else {
            	//Else, enable content streching
            	$('.left-side').toggleClass("collapse-left");
            	$(".right-side").toggleClass("strech");
        	}
    	});
    });
