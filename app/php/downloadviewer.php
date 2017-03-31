<?php
class DownloadViewer{
     public $synology_host;
     public $synology_port;
     public $synogeoip_host;
     public $synogeoip_port;
     public function __construct($syno_host, $syno_port, $geoip_host, $geoip_port){
          $this->synology_host = $syno_host;
          $this->synology_port = $syno_port;
          $this->synogeoip_host = $geoip_host;
          $this->synogeoip_port = $geoip_port;
     }
     public function login($username, $password){
		$credentials = http_build_query(array(
			"account" => $username,
			"passwd" => $password
		));
		return $this->getRequest("http://{$this->synology_host}:{$this->synology_port}/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&session=DownloadStation&format=sid&".$credentials);
	}
     public function getRequest($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
	}

	public function getdownloads($token){
		return $this->getRequest("http://{$this->synology_host}:{$this->synology_port}/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&additional=detail,file,transfer,peer&_sid={$token}");
	}
	public function getLocationFromIP($request){
		return $this->getRequest("http://{$this->synogeoip_host}:{$this->synogeoip_port}/json/".$request);
	}
	public function getLocationsFromIPS($request){
		$list = json_decode($request["list"]);
		$retArr = array();
		if($list){
			foreach ($list as $key => $value) {

				foreach ($value->list as $key1 => $value1) {
					$retArr[] = json_decode($this->getLocationFromIP($value1->address));
				}
			}
		}
		return $retArr;
	}
}
?>
