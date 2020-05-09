FROM nikolaik/python-nodejs:python3.7-nodejs10
WORKDIR /app 
COPY . /app 

RUN apt-get update 
RUN apt-get install sudo -y 
RUN apt-get install tesseract-ocr -y 
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader stopwords
WORKDIR ./server
RUN npm install
WORKDIR ../client
RUN npm install
EXPOSE 4000 3000
CMD ["npm", "run","serverClient"]