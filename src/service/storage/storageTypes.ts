export interface Storage{
    uploadBuffer: (path: string, fileBuffer: Buffer, type: fileTypes) => Promise<any>,
    downloadToBuffer: (path: string) => Promise<Buffer>,
    downloadToPath:(path: string, destPath: string) => Promise<any>
}

export enum fileTypes{
    Image = "image/jpeg",
    Csv = "text/csv",
    Text = "text/plain",
}