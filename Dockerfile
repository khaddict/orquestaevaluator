FROM python:3.9 as base
COPY . /app
WORKDIR /app
RUN python -m pip install -U pip 
RUN python -m pip install -r requirements.txt

FROM base as tz
RUN cp /usr/share/zoneinfo/America/Denver /etc/localtime
RUN echo "America/Denver" > /etc/timezone

FROM tz as secret
COPY session_secret /

FROM secret
ENTRYPOINT ["python"]
CMD ["app.py"]
