function addDownloadList(component, taskList) {
	var myList = component.attachList({
		template : "<span style='color:green'><b>#name#</b></span> <br/> #status#<br/>#percent#% (#speed#KB/s)",
		type : {
			height : "auto"
		}
	});
	myList.parse(taskList, "json");
	return myList;
}
var downloaderInterface = (function(layout){
	var tasks = null;
	var tasklist = null;
	var taskPeer = null;
	var myTabbar = null;
	var gmaps = null;
	var myList = null;
	var token = null;
	this.init = function(){
		$.ajaxSetup({async:false});
		$.get("./php/downloadviewerapp.php?action=getlogintoken", function(data) {
			
			if(data.success){
			
				token = data.data.sid;
			}
		});
		$.ajaxSetup({async:true});
		myTabbar = layout.cells("a").attachTabbar({
			align : "right",
			tabs : [{
				id : "a3",
				text : "Completed"
			}, {
				id : "a1",
				text : "In Progress",
				active : true
			}]
		});
		myTabbar.attachEvent("onSelect", this.onSelectTab);
		this.onSelectTab("a1");
		gmaps = layout.cells("b").attachMap();
		gmaps.zoom = 2;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'address' : 'Sedova str. 80, Saint Petersburg, Russia'
		}, function(results, status) {
			gmaps.setCenter({lat: 0, lng: 0});
		});
		setInterval(this.updateMap, 5000);
	};
	this.updateMap = function(){

		if (taskPeer) {
			$.post("./php/downloadviewerapp.php?action=getlocationsfromips", {
				list : JSON.stringify(taskPeer)
			}, function(data) {

				data.forEach(function(data) {
					var marker = new google.maps.Marker({
						position : {
							lat : data.latitude,
							lng : data.longitude
						},
						title : "dhtmlx Mailing Address"
					});
					marker.setMap(gmaps);
				});

			}, "json");
		}
	};
	this.onSelectTab = function(id, lastId) {
		$.get("./php/downloadviewerapp.php?action=getdownloads", {token : token}, function(data) {
			tasks = data.data.tasks;
			tasklist = tasks.map(function(obj) {
				var newObj = {
					name : obj.title,
					status : obj.status,
					percent : ((obj.additional.transfer.size_downloaded / obj.size)*100).toFixed(2),
					speed : ((obj.additional.transfer.speed_download) / 1000).toFixed(2)
				};
				return newObj;
			});
			taskPeer = tasks.map(function(obj) {
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
			//debugger;
			return newObj;
		});
			myList = addDownloadList(myTabbar.cells(id), tasklist);
			switch(id) {
				case "a1":
					myList.filter(function(obj, objB) {
						if (obj.status !== "paused" && obj.status !== "finished")
							return true;
						return false;
					});
					break;
				case "a2":
		
					break;
				case "a3":
					myList.filter(function(obj, objB) {
						if (obj.status !== "downloading")
							return true;
						return false;
					});
					break;
			}
			myList.sort(function(objA, objB) {
	
				// objA and objB - are the objects which need to be compared
				return objA.percent > objB.percent ? -1 : 1;
			}, "asc");
		},"json");	
		return true;
	};
	this.init();
});
function doOnLoad() {
	//downloader();
	var tasks = null;
	var taskList = null;
	var taskPeers = null;

	var myLayout = new dhtmlXLayoutObject({
		parent : document.body, // parent container
		pattern : "2U", // layout's pattern
		cells : [{
			id : "a",
			text : "Download List",
			width : 400,
			fix_size:       [true,null]
		}, {
			id : "b",
			text : "kmfjmfjmrj",
			header : false
		}]
	});
	downloaderInterface(myLayout);
}