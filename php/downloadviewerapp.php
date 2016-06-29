<?php
	ob_start("ob_gzhandler");
	header("access-control-allow-origin: *");
	//header('Content-Type: application/json');
	$request = (!empty($_REQUEST))?$_REQUEST:"";
	$action = (!empty($_REQUEST["action"]))?$_REQUEST["action"]:"";
	
	function getRequest($url, $isJSON = false){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch); 
        curl_close($ch);
        return ($isJSON == true)?json_decode($output):$output;
	}
	function login($username, $password){
		$credentials = http_build_query(array(
			"account" => $username,
			"passwd" => $password
		));
		return getRequest("http://192.168.1.27:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&session=DownloadStation&format=sid&".$credentials,true)->data->sid;
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
	$token = login("bmosley", "DricasM4x");
	$retArr = null;
	switch($action){
		case "getdownloads":
			$retArr = getdownloads($token, true);		
			break;
		case "getlocationfromip":
			$retArr = getLocationFromIP($request);
			break;
		case "getlocationsfromips":
			$retArr = getLocationsFromIPS($request);
			print(json_encode($retArr));
			die();
	}
	print($retArr);
?>