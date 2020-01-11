# Text-summrization-final-project


python3 marker.py -i test1.jpg

input.tsv file should contain the fixations



some steps to use gcloud

1.download gcloud
2.gcloud init
3.gcloud auth configure-docker 


some steps work with docker locally
1.docker build ./ -t locally/summareyez:1.0
2.docker run -i -p 3000:80 locally/summareyez:1.0 
3.docker ps (//see running container)
docker kill locally/summareyez:1.0
