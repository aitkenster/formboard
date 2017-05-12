var http = require("https");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var encoded_gb_key = new Buffer(process.env.GB_KEY).toString('base64')

exports.handler = (event, context, callback) => {
    eventEmitter.on('define_data', defineData);

    eventEmitter.on('data_defined', () => {
        geckoboardFormattedData = transformData(event.form_response)
        sendData(geckoboardFormattedData);
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

    eventEmitter.emit('define_data');
};

var defineData = () => {
    var dataDefinition = JSON.stringify({
        "fields": {
            "meat_favourite" : {
                "type": "string",
        "name": "Favourite meat"
            },
        "cooking_preference" : {
            "type": "string",
        "name": "How prefer it cooked"
        },
        "combo_rating": {
            "type": "number",
        "name": "Combo rating"
        },
        "timestamp": {
            "type": "datetime",
        "name": "Date"
        }
        },
        "unique_by": ["timestamp"]
    })

    var options = {
        "method": "POST",
        "hostname": "api.geckoboard.com",
        "path": "/datasets/meat.form",
        "headers": {
            "authorization": "Basic " + encoded_gb_key,
            "content-type": "application/json",
            "content-length": Buffer.byteLength(dataDefinition, 'utf8')
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log("defined data")
            eventEmitter.emit('data_defined')
        });
    });
    req.write(dataDefinition);
    req.end();
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

// post data
var sendData = (data) => {
    var testData = JSON.stringify(data);
    var options = {
        "method": "POST",
        "hostname": "api.geckoboard.com",
        "path": "/datasets/meat.form/data",
        "headers": {
            "authorization": "Basic " + encoded_gb_key,
            "content-type": "application/json",
            "content-length": Buffer.byteLength(testData, 'utf8')
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log("sent data");
            eventEmitter.emit('data_sent');
        });
    });

    req.write(testData);
    req.end();
};
