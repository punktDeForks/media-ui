type AssetVariantType = 'AssetVariant';
type CropInformationType = 'CropInformation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AssetVariant extends GraphQlEntity {
    __typename: AssetVariantType;
    readonly id: string;
    readonly presetIdentifier: string;
    readonly variantName: string;
    readonly hasCrop: boolean;

    width?: number;
    height?: number;

    previewUrl?: string;
    cropInformation: {
        __typename: CropInformationType;
        width: number;
        height: number;
        x: number;
        y: number;
    };
}
