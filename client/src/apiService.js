import axios from 'axios';

export const getSummary = async (experimentId,type,name) => {
    const res = await axios.get('/api/experiments/123/summary');
    return res.data;
}

export const getImages =  async () => {
    const res = await axios.get('/api/images');
    return res.data;
}

export const uploadImage =  async (name, buffer) => {
    const formData = new FormData();
    formData.append('imageBuffer', buffer);
    formData.append('imageName', name);

    const res = await axios.post('/api/upload',formData,{ 
        headers:{
            "Content-Type": "multipart/form-data"
        },
    });
    return res.data;
}

export const getSummaries = async (experimentId) => {
    const res = await axios.get('/api/experiments/123/summaries');
    return res.data;
}