//dom vars
var $yamlInput = $("#yamlInput");
var $yaqlInput = $("#yaqlInput");
var $resultArea = $("#result");
var $yaqlAlert = $("#yaqlAlert");
var $yamlAlert = $("#yamlAlert");

//api
var apiServerString = "/api";
var apiEvaluate = "/evaluate/";
var autoComplete = apiServerString + "/autoComplete/";
var evalReqObj = {
    "yaml": "",
    "yaql_expression": ""
};


function setYaml(yaml) {
        try {
            let a = JSON.parse(JSON.stringify(yaml));
            $("#yaqlAlert").css('display', 'none');
            $("#yamlInput").val(JSON.stringify(a, null, 4));
        }
        catch (jsonerr) {
            // Unable to parse JSON, maybe this is YAML?
            try {
                let a = jsyaml.safeLoad(yaml);
                $("#yaqlAlert").css('display', 'none');
                $("#yamlInput").val(jsyaml.safeDump(a));
            }
            catch (yamlerr) {
                $yaqlAlert.html("Invalid JSON or YAML " + jsonerr + "\n" + yamlerr);
                $("#yaqlAlert").css('display', 'block');
            }
        }
}

function setResultArea(json) {
    $resultArea.removeData();
    $resultArea.rainbowJSON({json: JSON.stringify(json)})
}

async function evaluate(data) {
    try {
      var url = apiServerString + apiEvaluate;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
        if (result.statusCode > 0) {
            setResultArea(result.value.evaluation);
            setYaml(result.value.payload);
        } else {
            parseError(result);
        }
    } catch (error) {
        parseError(error);
    }
  }

  function parseError (result) {
    if (result.error) {
        $yaqlAlert.html(result.error);
    } else {
        $yaqlAlert.html(result);
    }
    $("#yaqlAlert").css('display', 'block');
  }

function output(inp) {
    document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

$( document ).ready(function() {
    $yamlInput = $("#yamlInput");
    $yaqlInput = $("#yaqlInput");

    $resultArea = $("#result");
    $yaqlAlert = $("#yaqlAlert");
    $yamlAlert = $("#yamlAlert");

    $resultArea.rainbowJSON({
        maxElements: 0,
        maxDepth: 0,
        json: '{}'
    });
    //event handlers
    $("#evaluate").click(function () {
        $("#yaqlAlert").css('display', 'none')
        evalReqObj.yaml = $yamlInput.val();
        evalReqObj.yaql_expression = $yaqlInput.val();
        evaluate(evalReqObj);

    });
    $("#reformat").click(function () {
        let error = '';
        try {
            let a = JSON.parse($("#yamlInput").val());
            $("#yaqlAlert").css('display', 'none');
            $("#yamlInput").val(JSON.stringify(a, null, 4));
        }
        catch (jsonerr) {
            // Unable to parse JSON, maybe this is YAML?
            try {
                let a = jsyaml.safeLoad($("#yamlInput").val());
                $("#yaqlAlert").css('display', 'none');
                $("#yamlInput").val(jsyaml.safeDump(a));
            }
            catch (yamlerr) {
                $yaqlAlert.html("Invalid JSON or YAML " + jsonerr + "\n" + yamlerr);
                $("#yaqlAlert").css('display', 'block');
            }
        }
        return false
    });

    $yaqlInput.keydown(function (event) {
        if (event.keyCode == 13) {
            $("#evaluate").click();
            return false;
        }
        if (event.keyCode != 8 && event.keyCode != 32 && event.keyCode != 46 && event.keyCode < 48) {
            return;
        }
    });
});