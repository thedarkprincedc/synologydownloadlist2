<?php

class DownloadViewer{
     protected $ci;
     protected $logger;
     protected $settings;
     protected $synology_host;
     protected $synology_port;
     public function __construct($ci){
          $this->ci = $ci;
          $this->logger = $this->ci->get("logger");
          $this->settings = $this->ci->get("settings");
          $this->synology_host = ($this->settings["mode"] == "development")
               ? "192.168.1.27" : $this->settings["environment_vars"]["SYNOLOGY_HOST"];
          $this->synology_port = ($this->settings["mode"] == "development")
               ? "5000" : $this->settings["environment_vars"]["SYNOLOGY_PORT"];
          $this->synology_username = $this->settings["environment_vars"]["SYNOLOGY_USERNAME"];
          $this->synology_password = $this->settings["environment_vars"]["SYNOLOGY_PASSWORD"];
          $this->iplookup_host = $this->settings["environment_vars"]["IPLOOKUP_HOST"];
          $this->iplookup_port = $this->settings["environment_vars"]["IPLOOKUP_PORT"];
     }
     private function getRequest($url){
          $output = null;
          try{
               if(!function_exists('curl_version')){
                    throw new Exception ("Curl not found");
               }
               $ch = curl_init();
               curl_setopt($ch, CURLOPT_URL, $url);
               curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
               $output = curl_exec($ch);
               curl_close($ch);
          } catch (Exception $e){
               $output = file_get_contents($url);
          }
        return $output;
     }
     public function getLoginToken($request, $response, $args){
          $data = new stdClass();
          $queryParams = $request->getQueryParams();
          $credentials = http_build_query(array(
               "account" => ($queryParams["username"])?$queryParams["username"]:$this->synology_username,
               "passwd" => ($queryParams["password"])?$queryParams["password"]:$this->synology_password
          ));
          $data = $this->getRequest("http://{$this->synology_host}:{$this->synology_port}/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&session=DownloadStation&format=sid&{$credentials}");
          return $response->write($data)->withAddedHeader('Content-Type', 'application/json')->withAddedHeader('Access-Control-Allow-Origin', '*');
     }
     public function getDownloadList($request, $response, $args){
          $data = new stdClass();
          $token = $request->getQueryParams()["token"];
          $data = $this->getRequest("http://{$this->synology_host}:{$this->synology_port}/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&additional=detail,file,transfer,peer&_sid={$token}");
          return $response->write($data)->withAddedHeader('Content-Type', 'application/json')->withAddedHeader('Access-Control-Allow-Origin', '*');
     }
     public function getLocationFromIP($request, $response, $args){
          $data = new stdClass();
          if($iplist = $request->getParsedBody()){
               foreach ($request->getParsedBody()["data"] as $key => $value) {
                    if($value["peer"]){
                         foreach ($value["peer"] as $key => $value) {
                              $ipaddress = $value["address"];
                              $data->list[] = json_decode($this->getRequest("http://{$this->iplookup_host}:{$this->iplookup_port}/json/{$ipaddress}"));

                         }
                    }
               }
               return $response->withJson($data)->withAddedHeader('Access-Control-Allow-Origin', '*');
          }

          $ipaddress = $request->getQueryParams()["ipaddress"];
          $data = $this->getRequest("http://{$this->iplookup_host}:{$this->iplookup_port}/json/{$ipaddress}");
          return $response->withJson($data)->withAddedHeader('Access-Control-Allow-Origin', '*');
     }
     public function getInfo($request, $response, $args){
          $data = new stdClass();
          $data->name = "Synology Download List Resource";
          $data->version = "1.0";
          $data->resources = new stdClass();
          $data->resources->isSynologyConnected = $this->getRequest("http://192.168.1.27:5000");
          $data->resources->isFreeGoIPServerConnected = true;
          //$data->resources->env =
          return $response->withJson($data)->withAddedHeader('Access-Control-Allow-Origin', '*');
     }
     public function getResource($request, $response, $args){
          $data = new stdClass();
          //$data->resource[] = array( )
          return $response->withJson($data)->withAddedHeader('Access-Control-Allow-Origin', '*');
     }
}
