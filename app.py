from flask import Flask, request, jsonify, current_app, render_template, session

# Custom
from functools import wraps
import traceback
import sys
from yaqluator import yaqluator

app = Flask(__name__, static_url_path='/static')

# Pull the session secret key from the session key file
with open('session_secret', encoding="utf-8") as f:
    app.secret_key = f.read()

def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

@app.route("/api/evaluate/", methods=['POST'])
@jsonp
def handle_evaluate():
    if request.method == 'POST':
        try:
            app.logger.info("Incoming Request")
            app.logger.debug(request.json)
            data = request.json

            app.logger.info("Setting session values")
            session['expression'] = data['yaql_expression']
            session['json_yaml'] = data['yaml']

        except KeyError as e:
            return json_error_response(str(e))
        except Exception as e:
            return json_error_response(str(e))
        
        if data is None:
            return json_error_response("yaml and yaql_expression are missing in request body")
        if not "yaql_expression" in data:
            return json_error_response("yaql_expression is missing")
        if not "yaml" in data:
            return json_error_response("yaml is missing")
        
        yaml = data['yaml']
        yaql = data['yaql_expression']
        app.logger.debug(f"yaml payload: {yaml}")
        app.logger.debug(f"yaql payload: {yaql}")

        r = invoke(yaqluator.evaluate, {"expression": yaql,
                                        "data": yaml
                                        }
                    )
        # app.logger.debug(f"Returning: {r.json}")
        app.logger.debug(f"Returning: {r}")
        return r

@app.route("/api/autoComplete/", methods=['POST'])
@jsonp
def handle_auto_complete():
    data = request.json or request.form
    if data is None:
        return json_error_response("yaml and yaql_expression are missing in request body")
    if not "yaql_expression" in data:
        return json_error_response("yaql_expression is missing")
    if not "yaml" in data:
        return json_error_response("yaml is missing")
    legacy = str(data.get("legacy", False)).lower() == "true"
    return invoke(yaqluator.auto_complete, {"yaql_expression": data["yaql_expression"], "yaml_string": data["yaml"], "legacy":legacy})

def invoke(function, params=None, value_key="value"):
    try:
        params = params or {}
        response = function(**params)
        ret = {"statusCode": 1, value_key: response}
    except Exception as e:
        ret = error_response(str(e))

    try:
        # return jsonify(**ret)
        return ret
    except Exception as e:
        return json_error_response(format_exception(e))

def json_error_response(message):
    return jsonify({"statusCode": -1, "error": message})

def error_response(message):
    return {"statusCode": -1, "error": message}

def format_exception(e):
    exception_list = traceback.format_stack()
    exception_list = exception_list[:-2]
    exception_list.extend(traceback.format_tb(sys.exc_info()[2]))
    exception_list.extend(traceback.format_exception_only(sys.exc_info()[0], sys.exc_info()[1]))

    exception_str = "Traceback (most recent call last):\n"
    exception_str += "".join(exception_list)
    # Removing the last \n
    exception_str = exception_str[:-1]

    return exception_str

@app.route('/')
def doit(name=None):
    expression = session.get('expression', '')
    json_yaml = session.get('json_yaml', '')
    return render_template('index.html', name=name, expression=expression, json_yaml=json_yaml)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
