# pull official base image
FROM python:3.6

# set work directory
WORKDIR /etsin_finder

COPY requirements.txt /etsin_finder/

RUN apt update
RUN apt-get install libxml2-dev libxmlsec1-dev libxmlsec1-openssl -y

# install dependencies
RUN pip install --upgrade pip wheel
RUN pip install -r requirements.txt

# Set work directory
WORKDIR /

# Bundle app source
COPY . ./

# Make port available
EXPOSE 5000

ENV PYTHONPATH "/"

CMD ["python", "etsin_finder/finder.py"]
