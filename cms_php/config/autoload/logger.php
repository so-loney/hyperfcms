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

$driver = env('LOG_DRIVER', 'file');
$handlers = [];
if ($driver == 'file') {
    $handlers = [
        // info、waring、notice日志等
        [
            'class' => Core\Common\Handler\LogFileHandler::class,
            'constructor' => [
                'stream' => BASE_PATH . '/runtime/logs/hyperf.log',
                'level' => Monolog\Logger::INFO,
            ],
            'formatter' => [
                'class' => Monolog\Formatter\LineFormatter::class,
                'constructor' => [
                    'format' => "%datetime%||%channel%||%level_name%||%message%||%context%||%extra%\n",
                    'dateFormat' => null,
                    'allowInlineLineBreaks' => true,
                ],
            ]
        ],
        // debug日志
        [
            'class' => Core\Common\Handler\LogFileHandler::class,
            'constructor' => [
                'stream' => BASE_PATH . '/runtime/logs/hyperf-debug.log',
                'level' => Monolog\Logger::DEBUG,
            ],
            'formatter' => [
                'class' => Monolog\Formatter\LineFormatter::class,
                'constructor' => [
                    'format' => "%datetime%||%channel%||%level_name%||%message%||%context%||%extra%\n",
                    'dateFormat' => null,
                    'allowInlineLineBreaks' => true,
                ],
            ]
        ],
        // error日志
        [
            'class' => Core\Common\Handler\LogFileHandler::class,
            'constructor' => [
                'stream' => BASE_PATH . '/runtime/logs/hyperf-error.log',
                'level' => Monolog\Logger::ERROR,
            ],
            'formatter' => [
                'class' => Monolog\Formatter\LineFormatter::class,
                'constructor' => [
                    'format' => "%datetime%||%channel%||%level_name%||%message%||%context%||%extra%\n",
                    'dateFormat' => null,
                    'allowInlineLineBreaks' => true,
                ],
            ]
        ],
    ];
}
if ($driver == 'db') {
    $handlers = [
        // 数据库日志存储
        [
            'class' => Core\Common\Handler\LogDbHandler::class,
            'formatter' => [
                'class' => Monolog\Formatter\LineFormatter::class,
                'constructor' => [
                    'format' => "%datetime%||%channel%||%level_name%||%message%||%context%||%extra%\n",
                    'dateFormat' => null,
                    'allowInlineLineBreaks' => true,
                ],
            ]
        ],
    ];
}
if ($driver == 'sls') {
    $handlers = [
        // 数据库日志存储
        [
            'class' => Core\Common\Handler\LogSlsHandler::class,
            'formatter' => [
                'class' => Monolog\Formatter\LineFormatter::class,
                'constructor' => [
                    'format' => "%datetime%||%channel%||%level_name%||%message%||%context%||%extra%\n",
                    'dateFormat' => null,
                    'allowInlineLineBreaks' => true,
                ],
            ]
        ],
    ];
}


return [
    'default' => [
        // 配置多个hander，根据每个handel产生日志
        'handlers' => $handlers
    ],
];
