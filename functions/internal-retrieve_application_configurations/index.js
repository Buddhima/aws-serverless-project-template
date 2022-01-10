
const AWS = require('aws-sdk');
const SSM = new AWS.SSM();

const stepfunction = 'testing';
const lambdafunction = 'internal-retrieve_application_configurations';

const prefix = '/org/internal/';

exports.handler = async (event) => {
    
    let log_message = 'Event received for retrieving configurations';
    console.info(`StepFunction: ${stepfunction}, LambdaFunction: ${lambdafunction}, Message: ${log_message}`);
    
    var environment = process.env.Deployment;
    
    if (!environment) {
        log_message = `Environment variable Deployment not found`;
        console.error(`StepFunction: ${stepfunction}, LambdaFunction: ${lambdafunction}, Message: ${log_message}`);
    }
    
    log_message = `prefix: ${prefix}, environment: ${environment}`;
    console.info(`StepFunction: ${stepfunction}, LambdaFunction: ${lambdafunction}, Message: ${log_message}`);
    
    var responseFromSSM = null;
    
    var parameter = {
                "Name" : prefix + environment
            };

    responseFromSSM = await SSM.getParameter(parameter).promise();
    
    log_message = `Retrieving values success, retrieved value: ${responseFromSSM}`;
    console.info(`StepFunction: ${stepfunction}, LambdaFunction: ${lambdafunction}, Message: ${log_message}`);
    
    var value = responseFromSSM.Parameter.Value; 
    var configObj = JSON.parse(value);
    
    event.configurations = configObj;
    
    log_message = 'Event payload : ' + JSON.stringify(event);
    console.info(`StepFunction: ${stepfunction}, LambdaFunction: ${lambdafunction}, Message: ${log_message}`);
    
    return event;
};
