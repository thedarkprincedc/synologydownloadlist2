define(['jquery', 'dhtmlx'], function($, dhtmlx){
	var app = {
		getDownloads : function(){
			return  $.get(app.config.resources.host + "/php/downloadviewerapp.php?action=getdownloads", {token : app.config.synokey});
		},
		getlocationsfromips : function(taskPeer){
			$.post(app.config.resources.host + "/php/downloadviewerapp.php?action=getlocationsfromips", {
				list : JSON.stringify(taskPeer)
			});
		},
		components : {}
	}, synokey;
	app.config = $.ajax({ type: "GET", url: "config.json", async: false }).responseJSON;
	if(synokey = $.ajax({ type: "GET", url: app.config.resources.host + "/php/downloadviewerapp.php?action=getlogintoken", async: false }).responseJSON){
		app.config.synokey = (synokey.data.sid)? synokey.data.sid : "";
	}
	return app;
});
