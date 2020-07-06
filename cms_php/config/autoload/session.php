<?php

declare(strict_types=1);
/**
 * This file is part of Hyperf.
 *
 * @link     https://www.hyperf.io
 * @document https://doc.hyperf.io
 * @contact  group@hyperf.io
 * @license  https://github.com/hyperf/hyperf/blob/master/LICENSE
 */

use Hyperf\Session\Handler;

$driver = env('SESSION_DRIVER', 'file');
if ($driver == 'file') {
    $handler = Handler\FileHandler::class;
}
if ($driver == 'redis') {
    $handler = Handler\RedisHandler::class;
}
return [
    'handler' => $handler,
    'options' => [
        'connection' => 'session',
        'path' => BASE_PATH . '/runtime/session',
        'gc_maxlifetime' => 60*60*24*3, // 3天
    ],
];
