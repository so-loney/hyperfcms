<?php

declare(strict_types=1);
/**
 * Created by PhpStorm.
 *​
 * aliyun_oss.php
 *
 * 阿里云oss配置
 *
 * User：YM
 * Date：2019/12/23
 * Time：下午5:05
 */

return [
    'endpoint' => env('ALIYUN_OSS_ENDPOINT', 'http://oss-cn-beijing.aliyuncs.com'),
    'access_key' => env('ALIYUN_OSS_AK', ''),
    'secret_key' => env('ALIYUN_OSS_SK', ''),
    'bucket' => [
        'cdn' => [
            'name' => 'ymkj-cdn',
            'host' => 'ymkj-data.oss-cn-beijing.aliyuncs.com',
        ],
        'data' => [
            'name' => 'ymkj-data',
            'host' => 'ymkj-data.oss-cn-beijing.aliyuncs.com',
        ]
    ],
    // oss上传图片后的回调地址
    'callback_url' => 'http://demo.hyperfcms.com/public/notify/oss_callback',
];
