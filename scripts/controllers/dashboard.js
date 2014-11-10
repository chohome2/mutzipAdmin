'use strict';

angular.module('mutzipAdminApp')
  .controller('DashboardCtrl', function ($scope, Auth) {
		var line = new Morris.Line({
        	element: 'line-chart',
            resize: true,
    	    data: [
       	     {y: '2014-09-01', revenue: 200000},
       	     {y: '2014-09-02', revenue: 300000},
       	     {y: '2014-09-03', revenue: 400000},
       	     {y: '2014-09-04', revenue: 200000},
       	     {y: '2014-09-05', revenue: 100000},
       	     {y: '2014-09-06', revenue: 500000},
       	     {y: '2014-09-07', revenue: 400000},
       	     {y: '2014-09-08', revenue: 700000},
       	     {y: '2014-09-09', revenue: 200000},
       	     {y: '2014-09-10', revenue: 800000},
       	     {y: '2014-09-11', revenue: 600000},
       	     {y: '2014-09-12', revenue: 500000},
       	     {y: '2014-09-13', revenue: 500000},
       	     {y: '2014-09-14', revenue: 400000},
       	     {y: '2014-09-15', revenue: 500000},
       	     {y: '2014-09-16', revenue: 600000},
       	     {y: '2014-09-17', revenue: 300000},
       	     {y: '2014-09-18', revenue: 900000},
       	     {y: '2014-09-19', revenue: 100000},
       	     {y: '2014-09-20', revenue: 200000},
       	     {y: '2014-09-21', revenue: 500000},
        	],
                    xkey: 'y',
                    ykeys: ['revenue'],
                    labels: ['revenue'],
                    lineColors: ['#3c8dbc'],
                    hideHover: 'auto'
                });	
  });
