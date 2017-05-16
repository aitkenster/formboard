'use strict';

var assert = require( 'chai' ).assert;

var myLambda = require( '../index' );

describe('when creating a new dataset from a form description', function() {
    it('formats number fields correctly', function () {
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

    it('formats multiple choice fields correctly', function () {
        var fields = [{
            "id":"iLqM",
            "title":"How do you prefer it cooked?",
            "type":"multiple_choice"
        }]

        var expectedDefinition = {
            "fields": {
                "iLqM" : {
                    "type": "string",
                    "name": "How do you prefer it cooked?"
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
})
