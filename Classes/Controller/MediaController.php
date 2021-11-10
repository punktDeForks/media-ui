<?php

declare(strict_types=1);

namespace Flowpack\Media\Ui\Controller;

/*
 * This file is part of the Flowpack.Media.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Flowpack\Media\Ui\Tus\PartialUploadFileCacheAdapter;
use Flowpack\Media\Ui\Tus\TusEventHandler;
use Neos\Cache\Frontend\VariableFrontend;
use Neos\Flow\Annotations as Flow;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Module\AbstractModuleController;
use TusPhp\Events\TusEvent;
use TusPhp\Tus\Server;

/**
 * @Flow\Scope("singleton")
 */
class MediaController extends AbstractModuleController
{
    /**
     * @Flow\Inject
     * @var TusEventHandler
     */
    protected $tusEventHandler;

    /**
     * @var FusionView
     */
    protected $view;

    /**
     * @var string
     */
    protected $defaultViewObjectName = FusionView::class;

    /**
     * @Flow\Inject
     * @var PartialUploadFileCacheAdapter
     */
    protected $partialUploadFileCacheAdapater;

    /**
     * @var array
     */
    protected $viewFormatToObjectNameMap = [
        'html' => FusionView::class,
    ];

    /**
     * Renders the media ui application
     */
    public function indexAction(): void
    {
    }

    /**
     * @throws \ReflectionException
     */
    public function uploadAction(): void
    {
        $server = new Server($this->partialUploadFileCacheAdapater);
        // @todo: Set upload dir to data/temporary

        $server->event()->addListener('tus-server.upload.complete', function (TusEvent $event) {
            $this->tusEventHandler->processUploadedFile($event);
        });

        $server->serve()->send();
        exit(0);
    }
}
