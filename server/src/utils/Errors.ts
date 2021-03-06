
export const ERRORS = {
    //exists
    TEST_EXISTS: 'test already exists',
    EXP_EXISTS: 'experiment already exists',
    CUSTOM_SUMMARY_EXISTS: 'custom summary already exists',
    IM_EXISTS: 'image already exists',
    FORM_EXISTS: 'form already exists',
    AlG_EXISTS: 'algorithm already exists',
    MERGED_SUMMARY_EXISTS: 'merged summary already exists',
    TEST_PLAN_NAME_EXISTS: 'test plan name already exist',
    FORM_NOT_EDITABLE: 'form not editable',
    //not exists
    TEST_NOT_EXISTS: 'test not exists',
    EXP_NOT_EXISTS: 'experiment not exists',
    IM_NOT_EXISTS: 'image not exists',
    FORM_NOT_EXISTS: 'form not exists',
    AlG_NOT_EXISTS: 'algorithm not exists',
    SUMMARY_NOT_EXISTS: 'summary not exists',
    TEST_PLAN_NAME_NOT_EXISTS: 'test plan name does not exist',
    SENT_TBL_NOT_EXISTS: 'base_sent_table not exist',
    WORD_OCR_TBL_NOT_EXISTS: 'word_ocr does not exist',
    
}
    
export const ERROR_STATUS = {
    GENERAL_ERROR: -1,
    PYTHON_ERROR: -2,
    COLLECTION_ERROR: -3,
    STORAGE_ERROR: -4,
    NAME_NOT_VALID: -5,
    OBJECT_NOT_EXISTS: -6,
}