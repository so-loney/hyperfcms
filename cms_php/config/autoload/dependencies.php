<?php

declare(strict_types=1);
/**
 * This file is part of Hyperf.
 * 改变依赖关系
 *
 * @link     https://www.hyperf.io
 * @document https://doc.hyperf.io
 * @contact  group@hyperf.io
 * @license  https://github.com/hyperf-cloud/hyperf/blob/master/LICENSE
 */

return [
    \Hyperf\Contract\StdoutLoggerInterface::class => \Core\Common\HF\StdoutLoggerFactory::class,
    \Psr\EventDispatcher\EventDispatcherInterface::class => \Core\Common\HF\EventDispatcherFactory::class,
];
