
export interface PythonScriptInterface {
    processImage: (imageBuffer: Buffer) =>
        Promise<{
            text?: string,
            word_ocr?: Buffer,
            base_sent_table?: Buffer}>;

    runAutomaticAlgs: (algsNames: string[], text, base_sent_table) =>
        Promise<{
            tables?: {
                name:string,
                sent_table: Buffer}[]
        }>;
       
}