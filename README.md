# Formboard

AWS Lambda function which lets you display data whih you collected via [Typeform](https://www.typeform.com/) in [Geckoboard](https://www.geckoboard.com/) 

<img src="https://photos-4.dropbox.com/t/2/AAAiYbqRZhup3f28GOqpn-bhk5Wwi8Jx4u_2L6imQONGYg/12/587988673/png/32x32/3/1495810800/0/2/Screenshot%202017-05-26%2012.20.08.png/ELmZh94EGBYgAigC/qhHEa_dc7SFj1sEZIb3X77A5sAS-5kGWhs_CZJebHsg?dl=0&size=800x600&size_mode=4" width="400"> <img src="https://photos-1.dropbox.com/t/2/AABBWPHj75-gXC7sRQGxn3twPfj6ekvG7q7YFrHveby54g/12/587988673/png/32x32/3/1495810800/0/2/Screenshot%202017-05-26%2012.18.19.png/ELmZh94EGBUgAigC/IDT4iIoECStEB93P7yEXODp0ZD4qwiuQpx8nu6yyKr0?dl=0&size=2048x1536&size_mode=" width="400">

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
