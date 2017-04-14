<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header
        'mode' => 'development',
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],
        'environment_vars' => [
            'SYNOLOGY_HOST' => getenv("SYNOLOGY_HOST"),
            'SYNOLOGY_PORT' => getenv("SYNOLOGY_PORT"),
            'SYNOLOGY_USERNAME' => getenv("SYNOLOGY_USERNAME"),
            'SYNOLOGY_PASSWORD' => getenv("SYNOLOGY_PASSWORD"),
            'IPLOOKUP_HOST' => getenv("IPLOOKUP_HOST"),
            'IPLOOKUP_PORT' => getenv("IPLOOKUP_PORT"),
        ],
        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
    ],
];
