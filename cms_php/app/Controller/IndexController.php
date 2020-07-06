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

namespace App\Controller;

use Hyperf\HttpServer\Annotation\AutoController;

/**
 * IndexController
 * 类的介j
 * @package App\Controller
 * User：YM
 * Date：2019/11/12
 * Time：下午5:03
 *
 *
 *
 * @AutoController()
 *
 */


class IndexController extends BaseController
{
    /**
     * index
     * 函数的含义说明
     * User：YM
     * Date：2019/11/13
     * Time：上午9:58
     * @return array
     */
    public function index()
    {
        $user = $this->request->input('aa', 'Hyperf2');
        $method = $this->request->getMethod();
//        throw new \App\Exception\BusinessException(StatusCode::ERR_EXCEPTION,'11');
//        $tmp = $this->testRepo->test();
        //return $this->success([$tmp]);

        $data = [
//            'method1' => $method,
//            'message' => $tmp,
//            'aaaa' => getCookie('aaa'),
//            'QQ' => $this->request->getHeaders(),
//            'DDD' => $this->request->getServerParams(),
//            'bb' => $this->request->getCookieParams(),
//            'adb' => getClientInfo(),
            '888' => array_values(swoole_get_local_ip()),
//            '999' => $this->request->getBody(),
            '090' => getSessionId(),
            '999' => getAllSession(),
//            '98989' => getLogArguments(),
            '0909' => $this->request->getHeaders(),
            '98989' => $this->request->getServerParams(),
            '88888' => $this->request->fullUrl(),
            '1288' => getLogArguments(),
//            '2222' => $text,
//            '3333' => getHostByName(getHostName()),
        ];

        return $this->success($data);
    }

    public function test()
    {
        $method = $this->request->getMethod1();
    }
}
