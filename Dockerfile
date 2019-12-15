FROM nikolaik/python-nodejs:latest
WORKDIR /app 
COPY . /app 
RUN apt-get update 
RUN apt-get install tesseract-ocr -y 
RUN npm install 
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt
RUN python3 -m nltk.downloader punkt
EXPOSE 3000 
CMD ["node", "index.ts"]