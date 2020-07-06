<?php
/**
 * Created by PhpStorm.
 *​
 * Cookie.php
 *
 * cookie处理
 *
 * User：YM
 * Date：2019/12/16
 * Time：下午10:14
 */


namespace Core\Common\Facade;

use Hyperf\HttpServer\Contract\RequestInterface;
use Hyperf\HttpServer\Contract\ResponseInterface;
use Hyperf\Utils\ApplicationContext;
use Hyperf\Utils\Context;
use Hyperf\HttpMessage\Cookie\Cookie as HyperfCookie;
use Psr\Http\Message\ResponseInterface as PsrResponseInterface;

/**
 * Cookie
 * cookie处理
 * @package Core\Common\Facade
 * User：YM
 * Date：2019/12/16
 * Time：下午10:14
 */
class Cookie
{
    /**
     * set
     * 设置cookie
     * User：YM
     * Date：2019/12/17
     * Time：上午12:03
     * @static
     * @param string $key
     * @param string $value
     * @param int $expire
     * @param string $path
     * @param string $domain
     * @param bool $secure
     * @param bool $httpOnly
     * @param bool $raw
     * @param null|string $sameSite
     */
    public static function set(string $key, $value = '', $expire = 0, string $path = '/', string $domain = '', bool $secure = false, bool $httpOnly = true, bool $raw = false, ?string $sameSite = null)
    {
        // convert expiration time to a Unix timestamp
        if ($expire instanceof \DateTimeInterface) {
            $expire = $expire->format('U');
        } elseif (! is_numeric($expire)) {
            $expire = strtotime($expire);
            if ($expire === false) {
                throw new \RuntimeException('The cookie expiration time is not valid.');
            }
        }
        $response = ApplicationContext::getContainer()->get(ResponseInterface::class);
        $cookie = new HyperfCookie($key, (string)$value, $expire, $path, $domain, $secure, $httpOnly, $raw, $sameSite);
        $response = $response->withCookie($cookie);
        Context::set(PsrResponseInterface::class, $response);
        return;
    }

    /**
     * get
     * 获取cookie
     * User：YM
     * Date：2019/12/17
     * Time：上午12:13
     * @static
     * @param string $key
     * @param null|string $default
     * @return mixed
     */
    public static function get(string $key,?string $default = null)
    {
        $request = ApplicationContext::getContainer()->get(RequestInterface::class);
        return $request->cookie($key, $default);
    }

    /**
     * has
     * 判断cookie是否存在
     * User：YM
     * Date：2019/12/17
     * Time：上午12:16
     * @static
     * @param string $key
     * @return bool
     */
    public static function has(string $key)
    {
        $request = ApplicationContext::getContainer()->get(RequestInterface::class);
        return $request->hasCookie($key);
    }

    /**
     * del
     * 删除cookie
     * User：YM
     * Date：2019/12/17
     * Time：上午12:21
     * @static
     * @param string $key
     * @return bool
     */
    public static function del(string $key) :bool
    {
        if (!self::has($key)) {
            return false;
        }

        Self::set($key,'', time()-1);

        return true;
    }
}