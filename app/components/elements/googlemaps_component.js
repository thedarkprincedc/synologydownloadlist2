define(['jquery', 'dhtmlx', 'app'], function($, dhtmlx, app){
     return (function(){
          return {
               init : function(){
                    var gmaps = app.components.layoutObject.cells("b").attachMap();
                    gmaps.zoom = 2;
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                         'address' : 'Sedova str. 80, Saint Petersburg, Russia'
                    }, function(results, status) {
                         gmaps.setCenter({lat: 0, lng: 0});
                    });
                    return gmaps;

               }
          }
     })();
});
