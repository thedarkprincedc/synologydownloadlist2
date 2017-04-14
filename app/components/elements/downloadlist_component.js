define(['jquery', 'dhtmlx', 'app'], function($, dhtmlx, app){
     return (function(){
          function filterFunc(obj, value){
               if(value === "In Progress")
                    return (obj.status !== "paused" && obj.status !== "finished")?true:false;
               else if(value === "Completed")
                    return (obj.status === "finished")?true:false;
               return true;
          }
          function getPeerList(tasklist){
               debugger;
               var taskPeer = tasklist.map(function(obj) {
                    if (obj.additional.peer) {
                         var listing = obj.additional.peer.map(function(obj) {
                              return {
                                   address : obj.address,
                                   agent : obj.agent
                              };
                         });
                    }
                    var newObj = {
                         title : obj.title,
                         id : obj.id,
                         list : listing
                    };
                    return newObj;
               });
          }


          return {
               onSelectTab : function(id){
                    app.components.layoutObject.cells("a").progressOn();
                    var list = app.components.tabbarObject.cells(id).attachList({
                         template : "<span style='color:green'><b>#name#</b></span> <br/> #status#<br/>#percent#% (#speed#KB/s)",
                         type : {
                              height : "auto"
                         }
                    });
                    app.getDownloads().then(function(data){
                         var tasklist = null;
                         var peerlist = null;
                         if(data.data.tasks){
                              tasklist = data.data.tasks.map(function(obj) {
                                   var newObj = {
                                        name : obj.title,
                                        status : obj.status,
                                        percent : parseFloat(((obj.additional.transfer.size_downloaded / obj.size)*100).toFixed(2)),
                                        speed : ((obj.additional.transfer.speed_download) / 1000).toFixed(2)
                                   };
                                   if(obj.status !== "finished"){
                                        newObj.peer = obj.additional.peer.map(function(obj) {
                                             return {
                                                  address : obj.address,
                                                  agent : obj.agent
                                             };
                                        });
                                   }

                                   return newObj;
                              });
                         }
                         app.tasklist = tasklist;
                         list.parse(tasklist, "json");
                         list.sort(function(objA, objB) {
                              return objA.percent > objB.percent ? -1 : 1;
                         }, "asc");
                         list.filter(filterFunc, app.components.tabbarObject.cells(id).getText());

                         app.components.layoutObject.cells("a").progressOff();
                    });
                    return true;
               },
               init : function(){
                    app.components.tabbarObject = app.components.layoutObject.cells("a").attachTabbar({
                         align : "right",
                         tabs : [{ id : "a3", text : "Completed" },
                                 { id : "a1", text : "In Progress", active : true }]
                    });
                    app.components.tabbarObject.attachEvent("onSelect", this.onSelectTab);
                    this.onSelectTab(app.components.tabbarObject.getActiveTab());
               }
          }
     })();
});
