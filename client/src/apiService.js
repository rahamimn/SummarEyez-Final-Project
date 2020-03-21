import axios from 'axios';

const api = {

    getSummary: async (experimentId,type,name) => {
        const res = await axios.get('/api/experiments/123/summary');
        return res.data;
    },

    getImages: async () => {
        const res = await axios.get('/api/images');
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
    

    getSummaries: async (experimentId) => {
        const res = await axios.get('/api/experiments/123/summaries');
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
            experimentName:'sss',
            algNames,
        });
        return res.data;
    },

    merge: async () => {

    }
}

export default api;