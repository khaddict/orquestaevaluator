# Orquesta Evaluator
This application will take yaql/jinja expressions and evaluate them against json/yaml text.

## Features
* This application will accept either yaml or json as the text input.
* Text input can be beautified for readability

## Requirements
* python 3.9+

## Getting Started
### non-Docker
* Update `session_secret` with any secret key
* Install requirements `pip install -r requirements.txt`
* Start Flask server `python3 app.py`
* Navigate to the application page `http://0.0.0.0:5000/`
### Docker
* Update `session_secret` with any secret key
* docker build --rm -t orquestaevaluator .
* docker run --rm -p 5000:5000 --name orquestaevaluator orquestaevaluator
* Navigate to the application page `http://[docker host]:5000/`

## Examples
Here are some screenshot examples.

Inline-style: 
![alt text](screenshots/screen-1.png "Simple json input")
![alt text](screenshots/screen-2.png "Retrieve status of core.echo")
![alt text](screenshots/screen-3.png "Retrieve output of core.echo")

## Credits
This project is heavily inspired by https://github.com/ALU-CloudBand/yaqluator - and in fact a bit of code was reused.