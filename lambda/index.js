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
        postToGeckoboardAPI(data, "/datasets/meat.form/data", "data_sent")
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

    definition = defineData(event.form_response.definition.fields)
    postToGeckoboardAPI(definition, "/datasets/meat.form", "data_defined")
};

var defineData = (fields) => {
    definition = {
        "fields": {
            "submitted_at": {
                "type": "datetime",
                "name": "Submit date"
            }
        },
        "unique_by": ["timestamp"]
    }
    fields.forEach(function (field) {
        definition.fields[field.id] = {
            "type": getFieldDataType(field),
            "name": field.title
        }
    });
    return definition
}

var getFieldDataType = (field) => {
    switch (field.type) {
        case "rating":
        case  "file_upload":
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
            "timestamp": formResponse.submitted_at
        }]
    formResponse.answers.forEach(function(answer) {
        switch (answer.field.id) {
            case 'yUz6':
                data[0].meat_favourite = answer.choice.label;
                break;
            case 'L31l':
                data[0].cooking_preference = answer.choice.label;
                break;
            case 'iLqM':
                data[0].combo_rating = answer.number;
                break;
            default:
                break;
        }
    });
    console.log("transformed data")
        return { "data": data };
};

var postToGeckoboardAPI = function(payload, path, eventName) {
    payloadString = JSON.stringify(payload)
    var options = {
        "method": "POST",
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

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(eventName + " completed")
            eventEmitter.emit(eventName)
        });
    });
    req.write(payloadString);
    req.end();
}

module.exports = {
    handler: handler,
    _defineData: defineData
}
