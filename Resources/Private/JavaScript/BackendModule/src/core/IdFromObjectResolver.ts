import { Asset, AssetCollection, AssetFile, AssetSource, Image, Tag } from '../interfaces';
import { defaultDataIdFromObject } from '@apollo/client';

/**
 * This resolver is used by the Apollo Cache to allow identifying
 * the entities for modification, especially for optimistic responses.
 */
export default function IdFromObjectResolver(object) {
    const id = `${object.__typename}_`;
    switch (object.__typename) {
        case 'Tag':
            return id + (object as Tag).id;
        case 'Asset':
            return id + (object as Asset).id;
        case 'AssetCollection':
            return id + (object as AssetCollection).id;
        case 'AssetSource':
            return id + (object as AssetSource).id;
        case 'Image':
            return id + (object as Image).url;
        case 'AssetFile':
            return id + (object as AssetFile).url;
        default:
            return defaultDataIdFromObject(object);
    }
}
