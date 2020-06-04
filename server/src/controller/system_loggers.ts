export var summarEyez_system_logger = require('logger').createLogger('summarEyez_system_logger.log'); // logs to a file
export var summarEyez_system_error_logger = require('logger').createLogger('summarEyez_system_error_logger.log'); // logs to a file

export var summarEyez_system_failure_logger = require('logger').createLogger('summarEyez_failier_logger.log'); // logs to a file


//regular system logger.
//will contain details of public function's name and it's input
export async function addToRegularLogger(string_func_name, object:Object) {

    summarEyez_system_logger.info("enteres ", string_func_name," called and recieved:  ", object );
}

//error system logger.
//will contain details of input error's 
export async function addToErrorLogger(string_func_name) {

    summarEyez_system_error_logger.info("error in func: ", string_func_name );

}

//system failure logger.
//will contain details of system failure's
export async function addToSystemFailierLogger(string_func_name) {

    summarEyez_system_failure_logger.info("error in func: ", string_func_name );
}