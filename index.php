<?php
// Workaround for Apache DirectoryIndex lookup
// This file is only used if Apache finds it before proxy
// Returns the same JSON response as Express route "/"

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: origin, x-requested-with, content-type, access_token, authorization');

echo json_encode([
    'success' => true,
    'message' => 'Nikki Super Backend API',
    'version' => '1.0.0',
    'endpoints' => [
        'health' => '/health',
        'user' => '/user',
        'product' => '/product',
        'media' => '/media',
        'career' => '/career',
        'testimoni' => '/testimoni',
        'content' => '/content',
        'searchbar' => '/searchbar'
    ],
    'timestamp' => date('c'),
    'note' => 'Served via PHP fallback (Apache DirectoryIndex)'
]);

