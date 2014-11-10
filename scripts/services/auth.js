'use strict';

angular.module('mutzipAdminApp')
    .factory('Auth', function($http, $cookies){
        $.cookie.json = true;
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        
		var accessLevels = routingConfig.accessLevels;
        var userRoles = routingConfig.userRoles;

        var currentUser;
        if(!$cookies.mutzip_user) currentUser = { username: '', role: userRoles.public };
        else currentUser = jQuery.parseJSON($cookies.mutzip_user);

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        return {
            authorize: function(accessLevel, role) {
                if(role === undefined) {
                    role = currentUser.role;
                }
                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function(user) {
                if(user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },
            register: function(user, success, error) {
                $http.post('/register', user).success(function(res) {
                    changeUser(res);
                    success();
                }).error(error);
            },
            login: function(user, success, error) {
                $http.post('/admin/login/', jQuery.param({'user':user.username,'passwd':user.password})).success(function(data){
                    console.log(data);
					if(data.status == "success") {
						var user = data.data[0];
						var role;
						console.log(user);
						
						if(user.role == 'USER') role = userRoles.user;
						else if(user.role == 'ADMIN') role = userRoles.admin;
						else {
							error();
							return;
						}
						$.cookie('mutzip_user', {'username': user.email, 'role': role ,'id': user.owner_id }, { expires: 1 });
						changeUser({'username': user.email, 'role': role ,'id': user.owner_id });
                    	success();
					}
					else error();
                }).error(error);
            },
            logout: function(success, error) {
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                $cookies.mutzip_user = "";
                success();
            },
            isAdmin: function() {
                if(currentUser.role.title == "admin") return true;
                return false;
            },
			updateCookie: function() {
				var user = currentUser;
			  	if( user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title ) {
					$.cookie('mutzip_user', currentUser, { expires: 1 });
				}
			},
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    });
