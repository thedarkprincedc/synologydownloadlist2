define(['jquery', 'app', 'googleMaps', 'downloadlist_component'], function($, app, googleMaps, downloadList){
     return (function(){
          app.components.layoutObject = new dhtmlXLayoutObject({
               parent : document.body,
               pattern : "2U",
               cells : [{ id : "a", width : 400, fix_size: [true,null], header : false },
                        { id : "b", header : false }]
          });
          try{
     		if(app.areResourcesAvailable().status != 200){
     			throw "Resource Directory is not available";
     		}else{
     			if(synokey = app.getLoginToken().responseJSON){
     				app.config.synokey = (synokey.data.sid)? synokey.data.sid : "";
     			}
     			else{
     				throw "No Synology credentials were supplied";
     			}
                    downloadList.init();
                    googleMaps.init();
     		}
     	}catch(e){
               dhtmlx.alert({
                    type:"alert-error",
				text: e,
                    function(result){

                    }
               });
     	}

     })();
});
