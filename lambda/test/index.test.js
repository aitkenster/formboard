'use strict';

var assert = require( 'chai' ).assert;

var myLambda = require( '../index' );

describe('when creating a new dataset from a form description', function() {
    it('formats fields fields correctly', function () {
        var fields = [{
            "id":"iLqM",
            "title":"How would you rate this combo?",
            "type":"rating"
        }]

        var expectedDefinition = {
            "fields": {
                "iLqM": {
                    "type": "number",
                    "name": "How would you rate this combo?"
                },
                "submitted_at": {
                    "type": "datetime",
                    "name": "Submit date"
                }
            },
            "unique_by": ["timestamp"]
        }
        assert.deepEqual(expectedDefinition, myLambda._defineData(fields));
    })

    it('applies the right data type to all fields', function () {
        var fields = [{
            "id":"iLqM",
            "title":"How do you prefer it cooked?",
        }]

        var expectedDefinition = {
            "fields": {
                "iLqM" : {
                    "name": "How do you prefer it cooked?"
                },
                "submitted_at": {
                    "type": "datetime",
                    "name": "Submit date"
                }
            },
            "unique_by": ["timestamp"]
        }
        var testCases = [
            {fieldType: "multiple_choice", dataType: "string" },
            {fieldType: "short_text", dataType: "string" },
            {fieldType: "long_text", dataType: "string" },
            {fieldType: "dropdown", dataType: "string" },
            {fieldType: "date", dataType: "date" },
            {fieldType: "email", dataType: "string" },
            {fieldType: "file_upload", dataType: "number" },
            {fieldType: "legal", dataType: "string" },
            {fieldType: "number", dataType: "number" },
            {fieldType: "opinion_scale", dataType: "number" },
            {fieldType: "payment", dataType: "money" },
            {fieldType: "picture_choice", dataType: "string" },
            {fieldType: "rating", dataType: "number" },
            {fieldType: "website", dataType: "string" },
            {fieldType: "yes_no", dataType: "string" },
        ]
        testCases.forEach(function(testCase) {
            fields[0].type = testCase.fieldType
            expectedDefinition.fields.iLqM.type = testCase.dataType
            assert.deepEqual(expectedDefinition, myLambda._defineData(fields));
        });
    })
})
