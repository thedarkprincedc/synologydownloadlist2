<?php
	require_once("downloadviewer.php");
	ob_start("ob_gzhandler");
	header("access-control-allow-origin: *");
	header('Content-Type: application/json');

	$request = (!empty($_REQUEST))?$_REQUEST:"";
	$action = (!empty($_REQUEST["action"]))?$_REQUEST["action"]:"";
	$token = (!empty($_REQUEST["token"]))?$_REQUEST["token"]:"";
	$SYNOLOGY_HOST = (getenv("SYNOLOGY_HOST"))?getenv("SYNOLOGY_HOST"):"localhost";
	$SYNOLOGY_PORT = (getenv("SYNOLOGY_PORT"))?getenv("SYNOLOGY_PORT"):5000;
	$SYNOLOGY_IPLOOKUP_HOST = (getenv("SYNOLOGY_IPLOOKUP_HOST"))?getenv("SYNOLOGY_IPLOOKUP_HOST"):"localhost";
	$SYNOLOGY_IPLOOKUP_PORT = (getenv("SYNOLOGY_IPLOOKUP_PORT"))?getenv("SYNOLOGY_IPLOOKUP_PORT"):3012;

	$downloadViewer = new DownloadViewer($SYNOLOGY_HOST,
									$SYNOLOGY_PORT,
									$SYNOLOGY_IPLOOKUP_HOST,
									$SYNOLOGY_IPLOOKUP_PORT);
	$retArr = null;

	switch($action){
		case "getlogintoken":
			print( $downloadViewer->login("bmosley", "DricasM4x"));
			die();
			break;
		case "getdownloads":
			$retArr = $downloadViewer->getdownloads($token);
			break;
		case "getlocationfromip":
			$retArr = $downloadViewer->getLocationFromIP($request);
			break;
		case "getlocationsfromips":
			$retArr = json_encode($downloadViewer->getLocationsFromIPS($request));
			break;
		case "info":
			print($SYNOLOGY_HOST);
			print($SYNOLOGY_PORT);
			print($SYNOLOGY_IPLOOKUP_HOST);
			print($SYNOLOGY_IPLOOKUP_PORT);
			break;
	}
	print($retArr);
?>
