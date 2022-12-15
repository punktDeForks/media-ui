interface UploadedFile extends File {
    id?: string;
    path?: string;
    preview?: string;
    lastModified: number;
    lastModifiedDate?: Date;
    name: string;
    size: number;
    type: string;
    copyrightNotice?: string;
    copyrightNoticeNotNeeded?: boolean;
    title?: string;
    caption?: string;
}
