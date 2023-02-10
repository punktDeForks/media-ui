import manifest from '@neos-project/neos-ui-extensibility';

import { MediaDetailsScreen } from '@media-ui/media-details-screen';
import { MediaSelectionScreen } from '@media-ui/media-selection-screen';
import { AssetUploadScreen } from '@media-ui/asset-upload-screen';

manifest('Flowpack.Media.Ui:AssetEditor', {}, (globalRegistry, { frontendConfiguration }) => {
    const secondaryEditorsRegistry = globalRegistry.get('inspector').get('secondaryEditors');

    const { useNewMediaSelection } = frontendConfiguration['Flowpack.Media.Ui'];

    const { useNewAssetUpload } = frontendConfiguration['Flowpack.Media.Ui'];

    if (useNewMediaSelection) {
        secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaDetailsScreen', {
            component: MediaDetailsScreen,
        });
        secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen', {
            component: MediaSelectionScreen,
        });
    }

    if (useNewAssetUpload) {
        secondaryEditorsRegistry.set('Neos.Neos/Inspector/Secondary/Editors/AssetUploadScreen', {
            component: AssetUploadScreen,
        });
    }
});
