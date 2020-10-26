<?php

declare(strict_types=1);

namespace Flowpack\Media\Ui\GraphQL\Resolver\Type;

/*
 * This file is part of the Flowpack.Media.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Doctrine\Common\Collections\ArrayCollection;
use Neos\Flow\Annotations as Flow;
use t3n\GraphQL\ResolverInterface;
use Neos\Media\Domain\Model\AssetCollection;
use Neos\Flow\Persistence\PersistenceManagerInterface;

/**
 * @Flow\Scope("singleton")
 */
class AssetCollectionResolver implements ResolverInterface
{
    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @param AssetCollection $assetCollection
     * @return string
     */
    public function id(AssetCollection $assetCollection): string
    {
        return $this->persistenceManager->getIdentifierByObject($assetCollection);
    }

    /**
     * @param AssetCollection $assetCollection
     * @return string
     */
    public function title(AssetCollection $assetCollection): string
    {
        return $assetCollection->getTitle();
    }

    /**
     * @param AssetCollection $assetCollection
     * @return ArrayCollection
     */
    public function assets(AssetCollection $assetCollection): array
    {
        return $assetCollection->getAssets()->toArray();
    }

    /**
     * @param AssetCollection $assetCollection
     * @return ArrayCollection
     */
    public function tags(AssetCollection $assetCollection): array
    {
        return $assetCollection->getTags()->toArray();
    }
}
