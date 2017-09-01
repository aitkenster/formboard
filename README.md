# Formboard

Connect a [typeform](https://www.typeform.com/) to [Geckoboard](https://www.geckoboard.com/) via an AWS Lambda function to build a data dashboard with the responses collected.

## Demo

See it in action:

| The [typeform](https://nicolaa.typeform.com/to/W0syNy)  | The [data dashboard](https://share.geckoboard.com/dashboards/3S7726UMLFW3UQGS) |
| ------------- | ------------- |
| [![typeform](https://user-images.githubusercontent.com/26118760/26932579-3029e27a-4c64-11e7-9391-a330d5d03deb.png)](https://nicolaa.typeform.com/to/W0syNy)  | [![data dashboard](https://user-images.githubusercontent.com/26118760/26932578-300f7eb2-4c64-11e7-9fe5-e7f2fa01d26e.png)](https://share.geckoboard.com/dashboards/3S7726UMLFW3UQGS)  |

## Setup

#### Prerequisites

- [AWS Lambda](https://aws.amazon.com/lambda/) account
- [Typeform](https://www.typeform.com/) Pro+ account
- [Geckoboard](https://www.geckoboard.com/) account

#### Install

1. Set up a Lambda function on AWS. The simplest way to get it running is to copy the contents of `lambda/index.js` into the lamda SDK. Alternatively, clone the repo and use the AWS CLI to deploy to Lambda with the script `./publish.sh`.

2. Set a GB_KEY env variable for the lambda function with a Geckoboard API key.

3. Set up an API on the AWS API Gateway with a `POST` request, and link it to the lambda function.

4. Paste the URL for the API on your typeform's webhooks dashboard (Configure panel).

5. The typeform results should now appear as a Geckoboard dataset, and can be customized to be displayed on a Geckoboard dashboard.

## Usage

#### Technologies

- AWS Lambda
- NodeJS

#### Current limitations

## Credits

Built by [@aitkenster](https://github.com/aitkenster)

#### Contributors

[@evaame](https://github.com/evaame) - documentation
