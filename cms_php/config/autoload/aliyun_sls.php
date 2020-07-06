<?php

declare(strict_types=1);
/**
 * Created by PhpStorm.
 *​
 * aliyun_sls.php
 *
 * 阿里云日志配置
 *
 * User：YM
 * Date：2019/12/23
 * Time：下午5:05
 */

return [
    'endpoint' => env('ALIYUN_SLS_ENDPOINT', 'cn-beijing.log.aliyuncs.com'),
    'access_key' => env('ALIYUN_SLS_AK', ''),
    'secret_key' => env('ALIYUN_SLS_SK', ''),
    'project' => env('ALIYUN_SLS_PROJECT', ''),
    'logstore' => env('ALIYUN_SLS_LOGSTORE', ''),
];
