define(['jquery', 'app', 'googleMaps', 'downloadlist_component'], function($, app, googleMaps, downloadList){
     return (function(){
          app.components.layoutObject = new dhtmlXLayoutObject({
               parent : document.body,
               pattern : "2U",
               cells : [{ id : "a", width : 400, fix_size: [true,null], header : false },
                        { id : "b", header : false }]
          });

          downloadList.init();
          googleMaps.init();
     })();
});
