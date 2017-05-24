var http = require("https");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var encoded_gb_key = ""

if (process.env.GB_KEY) {
    encoded_gb_key = new Buffer(process.env.GB_KEY).toString('base64')

}

var handler  = (event, context, callback) => {

    eventEmitter.on('data_defined', () => {
        data = transformData(event.form_response)
        console.log(JSON.stringify(data))
        postToGeckoboardAPI(data, "/datasets/" + datasetName + "/data", "data_sent")
    });

    eventEmitter.on('data_sent', () => {
        console.log("success")
        let response = {
            statusCode: '200',
            body: JSON.stringify({ message: 'Successfully sent data to Geckoboard!' }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    context.succeed(response);
    })

    datasetName = getDatasetName(event.form_response.definition)
        console.log(datasetName)
    definition = defineData(event.form_response.definition.fields)
    console.log(JSON.stringify(definition))
    postToGeckoboardAPI(definition, "/datasets/" + datasetName, "data_defined")
};

var defineData = (fields) => {
    definition = {
        "fields": {
            "submitted_at": {
                "type": "datetime",
                "name": "Submit date"
            }
        },
        "unique_by": ["submitted_at"]
    }
    fields.forEach(function (field) {
        definition.fields[field.id.toLowerCase()] = {
            "type": getFieldDataType(field),
            "name": field.title
        }
    });
    return definition
}

var getDatasetName = (formDefinition) => {
    return formDefinition.title.replace(" ", ".");
}

var getFieldDataType = (field) => {
    switch (field.type) {
        case "rating":
        case  "number":
        case  "opinion_scale":
            return "number";
        case "date":
            return "date";
        case "payment":
            return "money";
        default:
            return "string";
    }
}

var transformData = (formResponse) => {
    console.log(formResponse.submitted_at)
        date = new Date()
        data = [{
            "submitted_at": formResponse.submitted_at
        }]
    formResponse.answers.forEach(function(answer) {
        fieldRef = answer.field.id.toLowerCase();
        data[0][fieldRef] = extractAnswer(answer)
    });
    console.log("transformed data")
    return { "data": data };
};

var extractAnswer = (answerData) => {
    switch (answerData.type) {
        case 'boolean':
            return answerData.boolean ? "yes" : "no"
        case 'choice':
           return answerData.choice.label
        default:
           return answerData[answerData.type]
    }
};

var postToGeckoboardAPI = function(payload, path, eventName) {
    var method = eventName === 'data_defined' ? "PUT" : "POST"
    payloadString = JSON.stringify(payload)
    var options = {
        "method": method,
        "hostname": "api.geckoboard.com",
        "path": path,
        "headers": {
            "authorization": "Basic " + encoded_gb_key,
            "content-type": "application/json",
            "content-length": Buffer.byteLength(payloadString, 'utf8')
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on('error', function(exception) { console.log("[ERROR] from Geckoboard:" + exception); });
        if(res.statusCode != '200'){
            console.log("[ERROR] status code: " + res.statusCode)
        }

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            console.log(eventName + " completed")
            eventEmitter.emit(eventName)
        });
    }).on('error', function(e) {
        console.log('[ERROR] error posting data to geckoboard for' + eventName + ' :' + e.message);
    });

    req.write(payloadString);
    req.end();
}

module.exports = {
    handler: handler,
    _defineData: defineData,
    _getDatasetName: getDatasetName,
    _extractAnswer: extractAnswer,
}
