export const createImage = ({
    uploaded_date = Date.now(),
    name,
    image_path = 'path1',
    text_path = 'path2',
    word_ocr_path = 'path3',
    base_sent_table_path = 'path4',
}) => ({
    uploaded_date,
    name,
    image_path,
    text_path,
    word_ocr_path,
    base_sent_table_path,
});