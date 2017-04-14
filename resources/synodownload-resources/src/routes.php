<?php
// Routes

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");
    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});
$app->group('/api', function () use ($app) {
     $app->get('/getlogintoken', "\DownloadViewer:getLoginToken");
     $app->get('/getdownloadlist', "\DownloadViewer:getDownloadList");
     $app->get('/getlocationfromip', "\DownloadViewer:getLocationFromIP");
     $app->post('/getlocationfromips', "\DownloadViewer:getLocationFromIP");
     $app->get('/getinfo', "\DownloadViewer:getInfo");
});
