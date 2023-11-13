enum AssetChangeType {
    ASSET_CREATED = 'ASSET_CREATED',
    ASSET_UPDATED = 'ASSET_UPDATED',
    ASSET_REPLACED = 'ASSET_REPLACED',
    ASSET_REMOVED = 'ASSET_REMOVED',
}

interface AssetChange {
    assetId: string;
    lastModified: Date;
    type: AssetChangeType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AssetChangeQueryResult {
    changedAssets: {
        lastModified: Date;
        changes: AssetChange[];
    };
}
