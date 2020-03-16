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
    
    runAlgs: async (experimentId, algs) => {

    },

    merge: async () => {

    }
}

export default api;