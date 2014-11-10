'use strict';

angular
    .module('mutzipAdminApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
		'angular-carousel'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        var access = routingConfig.accessLevels;

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('anon', {
                abstract: true,
                template: '',
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: '/login/',
                templateUrl: 'views/login.html',
                controller:'LoginCtrl'
            });

        $stateProvider
            .state('user', {
                abstract: true,
                data: {
                    access: access.user
                }
            })
            .state('user.shop-list', {
                url: '/',
                templateUrl: 'views/shop-list.html',
                controller:'ShoplistCtrl'
            })
            .state('user.shop-info', {
                url: '/shop-info/:ownerId/:shopId',
                templateUrl: 'views/shop-info.html',
                controller:'ShopinfoCtrl'
            })
			.state('user.shop-modify', {
                url: '/shop-modify/:ownerId/:shopId',
                templateUrl: 'views/shop-modify.html',
                controller:'ShopinfoCtrl'
            })
			.state('user.shop-stylecut', {
                url: '/shop-stylecut/:ownerId/:shopId',
                templateUrl: 'views/shop-stylecut.html',
                controller:'ShopstylecutCtrl'
            })
			.state('user.shop-stylecut-create', {
                url: '/shop-stylecut-create/:shopId',
                templateUrl: 'views/shop-stylecut-create.html',
                controller:'ShopstylecutCtrl'
            })
			.state('user.shop-stylecut-delete', {
                url: '/shop-stylecut-delete/:shopId',
                templateUrl: 'views/shop-stylecut-delete.html',
                controller:'ShopstylecutCtrl'
            })
			.state('user.shop-stylecut-edit', {
                url: '/shop-stylecut-edit/:shopId',
                templateUrl: 'views/shop-stylecut-edit.html',
                controller:'ShopstylecutCtrl'
            })
			.state('user.shop-viewimage', {
                url: '/shop-viewimage/:ownerId/:shopId',
                templateUrl: 'views/shop-viewimage.html',
                controller:'ShopinfoCtrl'
            })
			.state('user.notice-list', {
                url: '/notice-list/',
                templateUrl: 'views/notice-list.html',
                controller:'NoticeCtrl'
            })
			.state('user.owner-update', {
		        url: '/owner-update/',
 	            templateUrl: 'views/owner-modify.html',
 	    	    controller:'AdminmanageuserCtrl'
			})
			.state('user.stats', {
		        url: '/stats/:shopId',
 	            templateUrl: 'views/stats.html',
 	    	    controller:'StatsCtrl'
			});


        $stateProvider
            .state('admin', {
                abstract: true,
                data: {
                    access: access.admin
                }
            })
			.state('admin.shop-create', {
                url: '/admin/shop-create',
                templateUrl: 'views/admin/shop-create.html',
                controller:'AdminshopCtrl'
            })
            .state('admin.shop-status', {
                url: '/admin/shop-status/:ownerId/:shopId',
                templateUrl: 'views/admin/shop-status.html',
                controller:'AdminshopCtrl'
            })
            .state('admin.shop-admin', {
                url: '/admin/shop-admin/:ownerId/:shopId',
                templateUrl: 'views/admin/shop-admin.html',
                controller:'AdminshopCtrl'
            })
            .state('admin.manage-user', {
                url: '/admin/manage-user',
                templateUrl: 'views/admin/manage-user.html',
                controller:'AdminmanageuserCtrl'
            })
            .state('admin.manage-user-create', {
                url: '/admin/manage-user/create',
                templateUrl: 'views/admin/manage-user-create.html',
                controller:'AdminmanageuserCtrl'
            })
			.state('admin.manage-user-modify', {
				url: '/admin/manage-user/modify/:ownerId',
                templateUrl: 'views/admin/manage-user-modify.html',
                controller:'AdminmanageuserCtrl'
            })
            .state('admin.manage-area', {
                url: '/admin/manage-area',
                templateUrl: 'views/admin/manage-area.html',
                controller:'AdminmanageareaCtrl'
            })
            .state('admin.manage-product', {
                url: '/admin/manage-product',
                templateUrl: 'views/admin/manage-product.html',
                controller:'AdminmanageproductCtrl'
            })
			.state('admin.manage-recommend-stylecut', {
	        	url: '/admin/manage-recommend-stylecut',
		    	templateUrl: 'views/admin/manage-recommend-stylecut.html',
		        controller:'AdminrecommendCtrl'
			})
			.state('admin.notice-create', {
                url: '/admin/notice-create/',
                templateUrl: 'views/admin/notice-create.html',
                controller:'NoticeCtrl'
            })
			.state('admin.notice-modify', {
				url: '/admin/notice-modify/:noticeId',
                templateUrl: 'views/admin/notice-modify.html',
                controller:'NoticemodifyCtrl'
            })
			.state('admin.dashboard', {
				url: '/admin/dashboard',
                templateUrl: 'views/admin/dashboard.html',
                controller:'DashboardCtrl'
            });


    })
    .run(function($rootScope, $state, Auth){
        $rootScope.$on('$viewContentLoaded',function(event, viewConfig){

            });

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
			$rootScope.error = null;
			$( "div.modal-backdrop.fade.in" ).remove();
			Auth.updateCookie();
			if (!Auth.authorize(toState.data.access)) {
				event.preventDefault();

                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('user.shop-list');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.login');
                    }
                }
            }
        });
    });
