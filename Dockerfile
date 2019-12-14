FROM nikolaik/python-nodejs:latest
WORKDIR /app 
COPY . /app 
RUN apt-get update 
RUN apt-get install tesseract-ocr -y 
RUN npm install 
RUN pip3 install -r requirements.txt --user
RUN python3 ./python_script/install.py
EXPOSE 3000 
CMD ["node", "index.ts"]