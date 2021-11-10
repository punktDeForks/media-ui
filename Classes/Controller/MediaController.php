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
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Utility\Environment;
use Neos\Flow\Utility\Exception;
use Neos\Fusion\View\FusionView;
use Neos\Neos\Controller\Module\AbstractModuleController;
use Neos\Utility\Exception\FilesException;
use Neos\Utility\Files;
use ReflectionException;
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
     * @Flow\Inject
     * @var Environment
     */
    protected $environment;

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
     * @Flow\InjectConfiguration(package="Flowpack.Media.Ui")
     * @var array
     */
    protected $settings;

    /**
     * Renders the media ui application
     */
    public function indexAction(): void
    {
    }

    /**
     * @throws Exception
     * @throws FilesException
     * @Flow\SkipCsrfProtection
     */
    public function uploadAction(): string
    {
        $uploadDirectory = Files::concatenatePaths([$this->environment->getPathToTemporaryDirectory(), 'TusUpload']);
        if (!file_exists($uploadDirectory)) {
            Files::createDirectoryRecursively($uploadDirectory);
        }

        $server = new Server();
        $server->setApiPath($this->controllerContext->getRequest()->getHttpRequest()->getUri()->getPath()) /** @phpstan-ignore-line */
            ->setUploadDir($uploadDirectory)
            ->setMaxUploadSize($this->getMaximumFileUploadSize())
            ->event()
                ->addListener('tus-server.upload.complete', function (TusEvent $event) {
                    $this->tusEventHandler->processUploadedFile($event);
                });

        $server->serve()->send();
        return '';
    }

    /**
     * Returns the maximum size of files that can be uploaded
     *
     * @return int
     */
    protected function getMaximumFileUploadSize(): int
    {
        // @todo: Move it to a configuration object and unify with QueryResolver methods
        try {
            return (int)Files::sizeStringToBytes($this->settings['maximimFileUploadSize'] ?? '100MB');
        } catch (FilesException $e) {
            return 0;
        }
    }
}
