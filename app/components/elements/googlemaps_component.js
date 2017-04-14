define(['jquery', 'dhtmlx', 'app'], function($, dhtmlx, app){
     return (function(){
          var gmaps = null;
          function updateMap(){
               if(app.tasklist){
                    $.post("./resources/public/api/getlocationfromips", {data : app.tasklist}, function(data) {
                         data.list.forEach(function(dataObj) {
                              var marker = new google.maps.Marker({
                                   position : {
                                        lat : dataObj.latitude,
                                        lng : dataObj.longitude
                                   },
                                   title : "dhtmlx Mailing Address"
                              });
                              marker.setMap(gmaps);
                         });

                    }, "json");
               }
     	};
          return {
               init : function(){
                    gmaps = app.components.layoutObject.cells("b").attachMap();
                    gmaps.zoom = 2;
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                         'address' : 'Sedova str. 80, Saint Petersburg, Russia'
                    }, function(results, status) {
                         gmaps.setCenter({lat: 0, lng: 0});
                         updateMap();
                         setInterval(updateMap, 10000);
                    });


                    return gmaps;

               }
          }
     })();
});
