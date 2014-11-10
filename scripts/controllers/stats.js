'use strict';

angular.module('mutzipAdminApp')
  .controller('StatsCtrl', function ($scope, Auth) {
		var line = new Morris.Line({
        	element: 'line-chart',
            resize: true,
    	    data: [
       	     {y: '2014-09-01', PV: 2666, UV: 1432},
             {y: '2014-09-02', PV: 2778, UV: 1012},
             {y: '2014-09-03', PV: 4912, UV: 3452},
             {y: '2014-09-04', PV: 3767, UV: 1132},
             {y: '2014-09-05', PV: 6810, UV: 4412},
             {y: '2014-09-06', PV: 5670, UV: 2492},
             {y: '2014-09-07', PV: 4820, UV: 1839},
             {y: '2014-09-08', PV: 15073, UV: 7392},
             {y: '2014-09-09', PV: 10687, UV: 3492},
             {y: '2014-09-10', PV: 8432, UV: 3230}
        	],
                    xkey: 'y',
                    ykeys: ['PV','UV'],
                    labels: ['PV','UV'],
                    lineColors: ['#3c8dbc','#a0d0e0'],
                    hideHover: 'auto'
                });	
  });
