
export const ERRORS = {
    //exists
    TEST_EXISTS: 'test already exists',
    EXP_EXISTS: 'experiment already exists',
    IM_EXISTS: 'image already exists',
    FORM_EXISTS: 'form already exists',
    AlG_EXISTS: 'algorithm already exists',
    TEST_PLAN_NAME_EXISTS: 'test plan name already exist',
    //not exists
    TEST_NOT_EXISTS: 'test not exists',
    EXP_NOT_EXISTS: 'experiment not exists',
    IM_NOT_EXISTS: 'image not exists',
    FORM_NOT_EXISTS: 'form not exists',
    AlG_NOT_EXISTS: 'algorithm not exists',
    SUMMARY_NOT_EXISTS: 'summary not exists',
    TEST_PLAN_NAME_NOT_EXISTS: 'test plan name does not exist',
    SENT_TBL_NOT_EXISTS: 'base_sent_table not exist',
}
    
export const ERROR_STATUS = {
    GENERAL_ERROR: -1,
    PYTHON_ERROR: -2,
    COLLECTION_ERROR: -3,
    STORAGE_ERROR: -4,
    NAME_NOT_VALID: -5,
    OBJECT_NOT_EXISTS: -6,
}