<?php

declare(strict_types=1);
/**
 * Created by PhpStorm.
 *​
 * Session.php
 *
 * session处理
 *
 * User：YM
 * Date：2020/1/3
 * Time：下午2:17
 */


namespace Core\Common\Facade;

use Hyperf\Utils\ApplicationContext;
use Hyperf\Contract\SessionInterface;

/**
 * Session
 * session处理
 * @package Core\Common\Facade
 * User：YM
 * Date：2020/1/3
 * Time：下午2:17
 */
class Session
{

    /**
     * setId
     * 设置sessionid
     * User：YM
     * Date：2019/12/19
     * Time：下午6:56
     * @param string $id
     */
    public static function setId(string $id)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        $session->setId($id);
        return ;
    }

    /**
     * getId
     * 获取sessionid
     * User：YM
     * Date：2019/12/19
     * Time：下午6:56
     */
    public static function getId()
    {
        $session =  ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->getId();
    }

    /**
     * set
     * 设置session
     * User：YM
     * Date：2019/12/19
     * Time：下午5:59
     * @param string $k
     * @param $v
     */
    public static function set(string $k,$v)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        $session->set($k,$v);
        return ;
    }

    /**
     * get
     * 获取session
     * User：YM
     * Date：2019/12/19
     * Time：下午7:32
     * @param string $k
     * @param null $default
     * @return mixed
     */
    public static function get(string $k,$default = null)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->get($k,$default);
    }

    /**
     * getAll
     * 获取所有session
     * User：YM
     * Date：2019/12/19
     * Time：下午7:32
     * @return mixed
     */
    public static function getAll()
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->all();
    }

    /**
     * has
     * 判断session是否存在
     * User：YM
     * Date：2019/12/19
     * Time：下午7:52
     * @param string $name
     * @return bool
     */
    public static function has(string $name)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->has($name);
    }

    /**
     * remove
     * 从 Session 中获取并删除一条数据
     * User：YM
     * Date：2019/12/19
     * Time：下午7:54
     * @param string $name
     * @return mixed
     */
    public static function remove(string $name)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->remove($name);
    }

    /**
     * forget
     * 从session中删除一条或多条数据
     * User：YM
     * Date：2019/12/19
     * Time：下午7:54
     * @param $keys string|array
     */
    public static function forget($keys)
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        $session->forget($keys);
        return;
    }

    /**
     * clear
     * 清空当前 Session 里的所有数据
     * User：YM
     * Date：2019/12/19
     * Time：下午7:56
     */
    public static function clear()
    {
        $session = ApplicationContext::getContainer()->get(SessionInterface::class);
        return $session->clear();
    }

}