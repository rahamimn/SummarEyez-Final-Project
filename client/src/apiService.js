import axios from 'axios';

const api = {

    getSummary: async (experimentName,type,name) => {
        const res = await axios.get(`/api/experiments/${experimentName}/summary?type=${type}&name=${name}`);
        return res.data;
    },

    exportSummaryCsv: async (experimentName,type,name) => {
        const res = await axios.get(`/api/experiments/${experimentName}/summary?csv=true&type=${type}&name=${name}`, { responseType: 'blob' });
        return res.data;
    },

    getImages: async () => {
        const res = await axios.get('/api/images');
        return res.data;
    },

    getExperiments: async () => {
        const res = await axios.get('/api/experiments');
        return res.data;
    },

    uploadImage: async (name, buffer) => {
        const formData = new FormData();
        formData.append('imageBuffer', buffer);
        formData.append('imageName', name);

        const res = await axios.post('/api/images',formData,{ 
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
        return res.data;
    },
    

    getSummaries: async (experimentName) => {
        const res = await axios.get(`/api/experiments/${experimentName}/summaries`);
        return res.data;
    },
    
    uploadAlgorithm: async (name, buffer) => {
        const formData = new FormData();
        formData.append('algorithmBuffer', buffer);
        formData.append('algorithmName', name);

        const res = await axios.post('/api/algorithms',formData,{ 
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
        return res.data;
    },

    runAlgs: async (experimentName,algNames) => {
        const res = await axios.post('/api/runAutoAlgs',{
            experimentName,
            algNames,
        });
        return res.data;
    },

    merge: async () => {

    },

    addExperiment: async (experimentName,imageName) => {
        const res = await axios.post('/api/experiments',{
            experimentName,
            imageName,
        });
        return res.data;
    },

    mergeAlgorithms: async(experimentName, mergedName, mergeInput) =>{
        const res = await axios.post(`/api/experiments/${experimentName}/summary/merge`,{
            name: mergedName,
            mergeInputs: mergeInput
        });
        return res.data;
    },

    uploadFixations: async (experimentName, name, buffer) => {
        const formData = new FormData();
        formData.append('fixations', buffer);
        formData.append('data', JSON.stringify({
            testId: name,
        }));
        const res = await axios.post(`/api/experiments/${experimentName}/tests`, formData,{ 
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
        return res.data;
    },


    addTest: async ({experimentName, testId, formId,  answers, sentanceWeights, buffer}) => {
        const formData = new FormData();
        if(buffer){
            formData.append('fixations', buffer);
        }
        formData.append('data', JSON.stringify({
            testId,
            formId,
            answers,
            sentanceWeights
        }));
        
        const res = await axios.post(`/api/experiments/${experimentName}/tests`, formData,{ 
            headers:{
                "Content-Type": "multipart/form-data"
            },
        });
        return res.data;
    },

    getForms: async (experimentName) => {
        const res = await axios.get(`/api/experiments/${experimentName}/forms`);
        return res.data;
    },

    getForm: async (experimentName, formName, onlyMetaData = false) => {
        const res = await axios.get(`/api/experiments/${experimentName}/forms/${formName}${onlyMetaData ? '?onlyMeta=true' : ''}`);
        return res.data;
    },

    addForm: async ({
        experimentName,
        name,
        isFillAnswers,
        isRankSentences,
        isReadSummary,
        withFixations,
        questionIds,
        summary,
    }) => {
        const res = await axios.post(`/api/experiments/${experimentName}/forms`,{
            name,
            isFillAnswers,
            isRankSentences,
            isReadSummary,
            withFixations,
            questionIds,
            summary,
        });
        return res.data;
    },

    getQuestions: async (experimentName) => {
        const res = await axios.get(`/api/experiments/${experimentName}/questions`);
        return res.data;
    },

    addQuestion: async (experimentName, question) => {
        const res = await axios.post(`/api/experiments/${experimentName}/questions`,question);
        return res.data;
    },

    getTestPlans: async () => {
        const res = await axios.get(`/api/allTestPlan`);
        return res.data;
    },

    addTestPlans: async (testPlanName, formsDetails) => {
        const res = await axios.post(`/api/testPlan`,{
            testPlanName,
            formsDetails
        });
        return res.data;
    }
}

export default api;
