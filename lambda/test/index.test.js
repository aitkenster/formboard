'use strict';

var assert = require( 'chai' ).assert;

var myLambda = require( '../index' );

describe('when creating a new dataset from a form description', function() {
    it('names the dataset correctly', function () {
        var formDescription = {
            "id":"ZTzDWO",
            "title":"formboard test"
        }

        assert.deepEqual("formboard.test", myLambda._getDatasetName(formDescription));
    });

    it('formats fields fields correctly', function () {
        var fields = [{
            "id":"iLqM",
            "title":"How would you rate this combo?",
            "type":"rating"
        }]

        var expectedDefinition = {
            "fields": {
                "ilqm": {
                    "type": "number",
                    "name": "How would you rate this combo?"
                },
                "submitted_at": {
                    "type": "datetime",
                    "name": "Submit date"
                }
            },
            "unique_by": ["submitted_at"]
        }
        assert.deepEqual(expectedDefinition, myLambda._defineData(fields));
    });

    it('applies the right data type to all fields', function () {
        var fields = [{
            "id":"iLqM",
            "title":"How do you prefer it cooked?",
        }]

        var expectedDefinition = {
            "fields": {
                "ilqm" : {
                    "name": "How do you prefer it cooked?"
                },
                "submitted_at": {
                    "type": "datetime",
                    "name": "Submit date"
                }
            },
            "unique_by": ["submitted_at"]
        }
        var testCases = [
            {fieldType: "multiple_choice", dataType: "string" },
            {fieldType: "short_text", dataType: "string" },
            {fieldType: "long_text", dataType: "string" },
            {fieldType: "dropdown", dataType: "string" },
            {fieldType: "date", dataType: "date" },
            {fieldType: "email", dataType: "string" },
            {fieldType: "file_upload", dataType: "string" },
            {fieldType: "legal", dataType: "string" },
            {fieldType: "number", dataType: "number" },
            {fieldType: "opinion_scale", dataType: "number" },
            {fieldType: "picture_choice", dataType: "string" },
            {fieldType: "rating", dataType: "number" },
            {fieldType: "website", dataType: "string" },
            {fieldType: "yes_no", dataType: "string" },
        ]
        testCases.forEach(function(testCase) {
            fields[0].type = testCase.fieldType
            expectedDefinition.fields.ilqm.type = testCase.dataType
            assert.deepEqual(expectedDefinition, myLambda._defineData(fields));
        });
    });

    it('adds the currency code to the dataset definition of money fields', function () {

        var fields = [{
            "id": "iLqM",
            "title": "Please enter your payment details",
            "type": "payment",
            "properties": {
                "currency": "USD"
            }
        }]

        var expectedDefinition = {
            "fields": {
                "ilqm" : {
                    "name": "Please enter your payment details",
                    "type": "money",
                    "currency_code": "USD",
                },
                "submitted_at": {
                    "type": "datetime",
                    "name": "Submit date"
                }
            },
            "unique_by": ["submitted_at"]
        }

        assert.deepEqual(expectedDefinition, myLambda._defineData(fields));
    });
})

describe('when creating a new dataset submission from form answers', function() {
    it('applies the right data type to the answers', function () {
        var testCases = [{
            answer: {
                "type":"choice",
                "choice": {"label":"Barcelona"},
                "field": {"id":"yUz6", "type":"multiple_choice" }
            },
            expected: 'Barcelona',
        },{
            answer: {
                "type":"number",
                "number":42,
                "field":{"id":"iLqM","type":"rating"}
            },
            expected: 42,
        },{
            answer: {
                "type": "boolean",
                "boolean": true,
                "field": { "id": "w0jx", "type": "yes_no" }
            },
            expected: "yes",
        },{
            answer: {
                "type": "email",
                "email": "an_account@example.com",
                "field": { "id": "cjzz", "type": "email" }
            },
            expected: "an_account@example.com",
        },{
            answer: {
                "type": "date",
                "date": "2017-02-06",
                "field": { "id": "Vdtv", "type": "date" }
            },
            expected: "2017-02-06",
        },{
            answer: {
                "type": "url",
                "url": "http:\/\/example-url.com",
                "field": { "id": "WyDu", "type": "website" }
            },
            expected: "http:\/\/example-url.com",
        },{
            answer:  {
                "type": "file_url",
                "file_url": "https:\/\/admin.typeform.com\/form\/results\/file\/download\/Npipjv\/qVCj\/file.ext",
                "field": { "id": "qVCj", "type": "file_upload" }
            },
            expected: "https:\/\/admin.typeform.com\/form\/results\/file\/download\/Npipjv\/qVCj\/file.ext",
        },{
            answer: {
                "type": "text",
                "text": "Lorem ipsum dolor",
                "field": { "id": "qSP9", "type": "short_text" }
            },
            expected: "Lorem ipsum dolor",
        },{
            answer: {
              "type": "payment",
              "payment": {
                "amount": "25",
                "last4": "4242",
                "name": "William Gates"
              },
              "field": { "id": "12345", "type": "payment" }
            },
            "expected": 2500,
        }]

        testCases.forEach(function(testCase) {
            assert.equal(testCase.expected, myLambda._extractAnswer(testCase.answer))
        });
    });
})
