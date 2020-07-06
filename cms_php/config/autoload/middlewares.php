<?php

declare(strict_types=1);
/**
 * This file is part of Hyperf.
 *
 * @link     https://www.hyperf.io
 * @document https://doc.hyperf.io
 * @contact  group@hyperf.io
 * @license  https://github.com/hyperf-cloud/hyperf/blob/master/LICENSE
 */

return [
    'http' => [
        \App\Middleware\RequestMiddleware::class, // 请求中间件
        \App\Middleware\CorsMiddleware::class, // 跨域处理
        \Hyperf\Session\Middleware\SessionMiddleware::class, // 就在这个里不要调换顺序
    ],
];
