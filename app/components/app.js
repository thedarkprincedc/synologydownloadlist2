define(['jquery', 'dhtmlx'], function($, dhtmlx){
	var app = {
		areResourcesAvailable : function(){
			return $.ajax({ url : "./resources/public", type : 'HEAD',  async: false });
		},
		getDownloads : function(){
			return  $.get("./resources/public/api/getdownloadlist", {token : app.config.synokey});
		},
		getlocationsfromips : function(taskPeer){
			return $.post("./resources/public/api/getlocationsfromips", { list : JSON.stringify(taskPeer) });
		},
		getLoginToken : function(){
			return $.ajax({ type: "GET", url: "./resources/public/api/getlogintoken", async: false });
		},
		components : {},
		config:{}
	}, synokey;

	
	return app;
});
