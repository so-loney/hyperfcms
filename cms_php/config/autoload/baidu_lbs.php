<?php

declare(strict_types=1);
/**
 * Created by PhpStorm.
 *​
 * baidu_lbs.php
 *
 * 文件描述
 *
 * User：YM
 * Date：2020/2/21
 * Time：下午11:33
 */

return [
    'base_url' => 'http://api.map.baidu.com/',
    'uri' => '/geocoding/v3/',
    'ak' => env('BaiDu_LBS_AK', ''),
    'sk' => env('BaiDu_LBS_SK', ''),
];
