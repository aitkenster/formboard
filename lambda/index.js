var http = require("https"),
    events = require("events"),
    eventEmitter = new events.EventEmitter(),
    encoded_gb_key = "";

if (process.env.GB_KEY) {
    encoded_gb_key = new Buffer(process.env.GB_KEY).toString("base64");
}

var handler = (event, context, callback) => {

    eventEmitter.on("data_defined", () => {
        data = transformData(event.form_response);
        postToGeckoboardAPI(data, "/datasets/" + datasetName + "/data", "data_sent");
    });

    eventEmitter.on("data_sent", () => {
        var response = {
            statusCode: "200",
            body: JSON.stringify({ message: "Successfully sent data to Geckoboard!" }),
            headers: {
                "Content-Type": "application/json",
            }
        };
        context.succeed(response);
    });

    datasetName = getDatasetName(event.form_response.definition);
    definition = defineData(event.form_response.definition.fields);
    postToGeckoboardAPI(definition, "/datasets/" + datasetName, "data_defined");
};

var defineData = (fields) => {
    definition = {
        "fields": {
            "submitted_at": {
                "type": "datetime",
                "name": "Submit date"
            }
        },
        "unique_by": ["submitted_at"],
    };
    fields.forEach(function (field) {
        var type = getFieldDataType(field),
            definitionID = field.id.toLowerCase();

        definition.fields[definitionID] = {
            "type": type,
            "name": field.title
        };

        if (type === "money") {
            definition.fields[definitionID].currency_code = field.properties.currency;
        }
    });
    return definition;
};

var getDatasetName = (formDefinition) => {
    return formDefinition.title.toLowerCase().replace(" ", ".");
};

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
};

var transformData = (formResponse) => {
    date = new Date();
    data = [{
        "submitted_at": formResponse.submitted_at
    }];
    formResponse.answers.forEach(function(answer) {
        fieldRef = answer.field.id.toLowerCase();
        data[0][fieldRef] = extractAnswer(answer);
    });
    return { "data": data };
};

var extractAnswer = (answerData) => {
    switch (answerData.type) {
        case "boolean":
            return answerData.boolean ? "yes" : "no";
        case "choice":
            return answerData.choice.label;
        case "payment":
            return parseFloat(answerData.payment.amount)*100;
        default:
            return answerData[answerData.type];
    }
};

var postToGeckoboardAPI = function(payload, path, eventName) {
    var method = eventName === "data_defined" ? "PUT" : "POST";
    payloadString = JSON.stringify(payload);
    var options = {
        "method": method,
        "hostname": "api.geckoboard.com",
        "path": path,
        "headers": {
            "authorization": "Basic " + encoded_gb_key,
            "content-type": "application/json",
            "content-length": Buffer.byteLength(payloadString, "utf8")
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });


        res.on("error", function(exception) {
            console.log("[ERROR] from Geckoboard:" + exception);
        });

        res.on("end", function () {
            if (!(res.statusCode == 200 || res.statusCode == 201)) {
                console.log("[ERROR] status code: " + res.statusCode);
                var body = Buffer.concat(chunks);
                console.log("[ERROR] from Geckoboard:" + body);
            }
            eventEmitter.emit(eventName);
        });
    }).on("error", function(e) {
        console.log("[ERROR] error posting data to geckoboard for" + eventName + " :" + e.message);
    });

    req.write(payloadString);
    req.end();
};

module.exports = {
    handler: handler,
    _defineData: defineData,
    _getDatasetName: getDatasetName,
    _extractAnswer: extractAnswer,
};
