<?php
	ob_start("ob_gzhandler");
	header("access-control-allow-origin: *");
	header('Content-Type: application/json');
	$request = (!empty($_REQUEST))?$_REQUEST:"";
	$action = (!empty($_REQUEST["action"]))?$_REQUEST["action"]:"";
	$token = (!empty($_REQUEST["token"]))?$_REQUEST["token"]:"";
	function getRequest($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch); 
        curl_close($ch);
        return $output;
	}
	function login($username, $password){
		$credentials = http_build_query(array(
			"account" => $username,
			"passwd" => $password
		));
		return getRequest("http://192.168.1.27:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&session=DownloadStation&format=sid&".$credentials);
	}
	function getdownloads($token){
		return getRequest("http://192.168.1.27:5000/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&additional=detail,file,transfer,peer&_sid={$token}");
	}
	function getLocationFromIP($request){
		return getRequest("http://192.168.1.27:3012/json/".$request);
	}
	function getLocationsFromIPS($request){
		$list = json_decode($request["list"]);
		$retArr = array();
		if($list){
			foreach ($list as $key => $value) {
				
				foreach ($value->list as $key1 => $value1) {
					$retArr[] = json_decode(getLocationFromIP($value1->address));
				}
			}
		}
		return $retArr;
	}
	$retArr = null;
	
	switch($action){
		case "getlogintoken":
			print(login("bmosley", "DricasM4x"));
			die();
			break;
		case "getdownloads":
			$retArr = getdownloads($token);		
			break;
		case "getlocationfromip":
			$retArr = getLocationFromIP($request);
			break;
		case "getlocationsfromips":
			$retArr = json_encode(getLocationsFromIPS($request));
	}
	print($retArr);
?>