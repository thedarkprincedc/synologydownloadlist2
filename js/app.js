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
var downloader = (function(cell){
	this.tasks = null;
	this.tasklist = null;
	this.taskPeer = null;
	this.init = function(){
		
	};
	this.getLocations = function(){
		$.get("./php/downloadviewerapp.php?action=getdownloads", function(data) {
		
		});
	};
	this.getLocationsFromIPS = function(){
		if (this.taskPeers) {
			$.post("./php/downloadviewerapp.php?action=getlocationsfromips", {
				list : JSON.stringify(taskPeers)
			}, function(data) {
				
			}, "json");
		}
	};
	
	this.getLocations();
	//setInterval(, 5000);
	//setInterval(this.getLocationsFromIPS, 10000);
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

	var myList = myLayout.cells("a").attachList({
		template : "<b>#name#</b> <br/> #status#<br/>#percent#% (#speed#KB/s)",
		type : {
			height : "auto"
		}
	});

	var myTabbar = myLayout.cells("a").attachTabbar({
		align : "right",
		tabs : [{
			id : "a3",
			text : "Completed"
		}, {
			id : "a1",
			text : "In Progress",
			active : true
		}],
		onload : function() {

		}
	});

	myTabbar.attachEvent("onSelect", function(id, lastId) {

		var myList = addDownloadList(myTabbar.cells(id), taskList);
		switch(id) {
			case "a1":
				myList.filter(function(obj, objB) {
					if (obj.status !== "paused")
						return true;
					return false;
				});
				break;
			case "a2":
	
				break;
			case "a3":
				myList.filter(function(obj, objB) {
					if (obj.status !== "completed")
						return true;
					return false;
				});
				break;
		}
		myList.sort(function(objA, objB) {

			// objA and objB - are the objects which need to be compared
			return objA.speed > objB.speed ? -1 : 1;
		}, "asc");
		return true;
	});
	//myTabbar.tabs("a1").setActive();
	$.get("./php/downloadviewerapp.php?action=getdownloads", function(data) {
		tasks = data.data.tasks;
		//debugger;
		taskPeers = tasks.map(function(obj) {
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
		taskList = tasks.map(function(obj) {

			var newObj = {
				name : obj.title,
				status : obj.status,
				percent : (obj.size / obj.additional.transfer.size_downloaded).toFixed(2),
				speed : ((obj.additional.transfer.speed_download) / 1000).toFixed(2)
			};
			return newObj;
		});

		myList.parse(taskList, "json");

		myList.sort(function(objA, objB) {

			// objA and objB - are the objects which need to be compared
			return objA.speed > objB.speed ? -1 : 1;
		}, "asc");
	}, "json");
	setInterval(function() {
		if (taskPeers) {
			$.post("./php/downloadviewerapp.php?action=getlocationsfromips", {
				list : JSON.stringify(taskPeers)
			}, function(data) {

				data.forEach(function(data) {
					var marker = new google.maps.Marker({
						position : {
							lat : data.latitude,
							lng : data.longitude
						},
						title : "dhtmlx Mailing Address"
					});
					marker.setMap(GMaps);
				});

			}, "json");
		}

	}, 5000);
	/*myList.parse([{
	 "id" : "1",
	 "Package" : "acx100-source",
	 "Version" : "20080210-1.1",
	 "Maintainer" : "Stefano Canepa"
	 }, {
	 "id" : "2",
	 "Package" : "alien-arena-browser",
	 "Version" : "7.0-1",
	 "Maintainer" : "Debian Games Team"
	 }, {
	 "id" : "3",
	 "Package" : "alien-arena-server",
	 "Version" : "7.0-1",
	 "Maintainer" : "Debian Games Team"
	 }], "json");*/
	var GMaps = myLayout.cells("b").attachMap();
	GMaps.zoom = 2;
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address' : 'Sedova str. 80, Saint Petersburg, Russia'
	}, function(results, status) {
		var styleArray = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];
		
		GMaps.setCenter({lat: 0, lng: 0});
		//GMaps.setStyles(styleArray);
		/*var marker = new google.maps.Marker({
			position : results[0].geometry.location,
			title : "dhtmlx Mailing Address"
		});
		marker.setMap(GMaps);
		var infowindow = new google.maps.InfoWindow({
			content : '<b>dhtmlx</b>'
		});
		infowindow.open(GMaps, marker);*/
	});

}