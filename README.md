# Formboard

AWS Lambda function which lets you display data whih you collected via [Typeform](https://www.typeform.com/) in [Geckoboard](https://www.geckoboard.com/) 

## Usage instructions

### Prequisites
- AWS account
- Typeform Pro+ account
- Geckoboard account

Set up a Lambda function on AWS. The simplest way to get this running is then to copy the contents of `lambda/index.js` into the lamda SDK. Alternatively, clone the repo and use the AWS CLI to deploy to Lambda with the script `./publish.sh`.
Set a GB_KEY env variable for the lambda function with a Geckoboard API key.

Set up an API on the AWS API Gateway with a `POST` request, and link this to the lambda function.

In the webhooks dashboard for your Typeform, paste the URL for the API.

The form results should now appear as a Geckoboard dataset, and can be customized to displaying in a dashboard.

### Technologies
- AWS Lambda
- NodeJS

### Todo
Support Typeform payment field
