rm index.zip
cd lambda
zip -X -r ../index.zip *
cd ..
aws lambda update-function-code --function-name sendToGeckoboard --zip-file fileb://index.zip --profile lambda-deploy
