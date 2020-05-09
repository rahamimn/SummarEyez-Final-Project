## Text-summarization: final-project

>  ###### Extract text based on reader`s eye movements 

![](https://i.ibb.co/kJrqX37/Summar-Eyez-Logo.png)

some steps to use gcloud

1.download gcloud
2.gcloud init
3.gcloud auth configure-docker 

some steps work with docker locally
1.docker build ./ -t locally/summareyez:1.0
2.docker run -i -p 3000:80 locally/summareyez:1.0 
3.docker ps (//see running container)
docker kill locally/summareyez:1.0