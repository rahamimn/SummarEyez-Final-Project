
export interface PythonScriptInterface {
    processImage: (imageBuffer: Buffer) =>
        Promise<{
            text?: Buffer,
            word_ocr?: Buffer,
            base_sent_table?: Buffer}>;

    runAutomaticAlgs: (algsNames: string[], text, base_sent_table) =>
        Promise<{
            tables?: {
                name:string,
                sent_table: Buffer}[]
        }>;

    mergeTables: (sammariesPercent: string[], sent_tables: Buffer[], base_sent_table:Buffer) =>
        Promise<{
            merged_table?: Buffer
        }>;
}