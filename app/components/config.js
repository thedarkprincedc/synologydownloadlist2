require.config({
	paths: {
		"jquery" : "../libs/vendor/jquery",
          "dhtmlx" : "../libs/vendor/dhtmlxSuite_v50_std/codebase/dhtmlx",
          "g" : "http://maps.google.com/maps/api/js?sensor=false&key=AIzaSyAzejE7EzH8BSE1arIe1P70t0ruZphqe9A",
          "app" : "app",
          "downloadlist_component" : "elements/downloadlist_component",
          "layout_component" : "elements/layout_component",
          "googleMaps" : "elements/googlemaps_component"
	},
	shim: {
		jquery: {
			exports: 'jquery'
		},
		googleMaps:{
			deps : ["g"]
		}
	}
});
require(['jquery', 'dhtmlx', "app", "layout_component", "googleMaps"], function($, dhtmlx){


});
