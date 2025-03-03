import React, { useCallback, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Button, CheckBox, Label } from '@neos-project/react-ui-components';

import { useIntl, useMediaUi, useNotify } from '@media-ui/core';
import { Dialog } from '@media-ui/core/src/components';
import { useAssetsQuery, useSelectedAsset } from '@media-ui/core/src/hooks';
import { featureFlagsState } from '@media-ui/core/src/state';

import editAssetDialogState from '../state/editAssetDialogState';
import useEditAsset, { AssetEditOptions } from '../hooks/useEditAsset';

import classes from './EditAssetDialog.module.css';

const EditAssetDialog: React.FC = () => {
    const { translate } = useIntl();
    const Notify = useNotify();
    const featureFlags = useRecoilValue(featureFlagsState);
    const [dialogVisible, setDialogVisible] = useRecoilState(editAssetDialogState);
    const { editAsset, loading } = useEditAsset();
    const {
        approvalAttainmentStrategy: { obtainApprovalToEditAsset },
    } = useMediaUi();
    const { refetch } = useAssetsQuery();
    const inputRef = useRef<HTMLInputElement>(null);
    const selectedAsset = useSelectedAsset();
    const [editOptions, setEditOptions] = React.useState<AssetEditOptions>({
        generateRedirects: false,
    });

    const closeDialog = useCallback(() => {
        setDialogVisible(false);
    }, [setDialogVisible]);

    const handleUpdate = useCallback(async () => {
        const hasApprovalToEditAsset = await obtainApprovalToEditAsset({
            asset: selectedAsset,
        });

        if (hasApprovalToEditAsset) {
            try {
                await editAsset({ asset: selectedAsset, filename: inputRef.current.value, options: editOptions });

                Notify.ok(translate('EditAssetDialog.updateFinished', 'Update finished'));
                closeDialog();
                void refetch();
            } catch (error) {
                Notify.error(translate('EditAssetDialog.updateError', 'Update failed'), error);
            }
        }
    }, [
        editAsset,
        Notify,
        translate,
        editOptions,
        refetch,
        selectedAsset,
        closeDialog,
        obtainApprovalToEditAsset,
        inputRef,
    ]);

    const filenameWithoutExtension = selectedAsset.filename.split('.').slice(0, -1).join('.');
    const canUpdate = !loading && selectedAsset.filename != inputRef.current?.value;

    return (
        <Dialog
            isOpen={dialogVisible}
            title={translate('editAssetDialog.title', 'Rename asset')}
            onRequestClose={() => setDialogVisible(false)}
            actions={[
                <Button key="cancel" style="neutral" hoverStyle="darken" onClick={closeDialog}>
                    {translate('editAssetDialog.cancel', 'Cancel')}
                </Button>,
                <Button key="upload" style="success" hoverStyle="success" disabled={!canUpdate} onClick={handleUpdate}>
                    {translate('editAssetDialog.update', 'Update')}
                </Button>,
            ]}
            style="wide"
        >
            <section className={classes.editArea}>
                <Label className={classes.label}>
                    {translate('editAssetDialog.filename', 'Filename')}
                    <input
                        className={classes.filenameInput}
                        type="text"
                        ref={inputRef}
                        defaultValue={filenameWithoutExtension}
                        onSubmit={handleUpdate}
                        disabled={loading}
                    />
                </Label>
                {featureFlags.createAssetRedirectsOption && (
                    <Label className={classes.label}>
                        <CheckBox
                            isChecked={editOptions.generateRedirects}
                            onChange={(generateRedirects) => setEditOptions({ ...editOptions, generateRedirects })}
                            disabled={loading}
                        />
                        <span>{translate('uploadDialog.generateRedirects', 'Generate redirects')}</span>
                    </Label>
                )}
                {loading && <p>{translate('EditAssetDialog.updating', 'Updating…')}</p>}
            </section>
        </Dialog>
    );
};

export default React.memo(EditAssetDialog);
