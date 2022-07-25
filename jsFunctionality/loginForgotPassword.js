function setCookie(name,value) {
    localStorage.setItem(name, value);
}

function displayBorderColor(idCode) { 
    $(`#${idCode}`).css('border-color', 'light-blue');
}

function timeOutdisplay() { 
    setInterval(function () {  
        $('#responseCarrier').hide();
    }, 10000);
}

function emptyField(fieldId) {
    $(fieldId).val('');
}

function display(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#submitId').html('Login');
    $('#submitId').attr('disabled', false);
    timeOutdisplay();
}

function displayResetPassword(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#forgotPassword').html('Reset New Password');
    $('#forgotPassword').attr('disabled', false);
    timeOutdisplay();
}

function messageDialog(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    timeOutdisplay();
}

function displayMessageInForm(value, textColor) {
    $('#passwordInformationId').text(value);
    $('#passwordInformationId').css('color', textColor);
    $('#passwordInformationId').css('font-weight', 'bold');
}

$(document).ready(function (){
    $('#responseCarrier').hide();
    
    $('#emailId').focus(function () { 
        var uEmail = $(this).val();

        if (uEmail == null || uEmail == '') {
            $(this).attr('Placeholder', 'Enter your Email address');
        }
    }).blur(function () {
        $(this).attr('Placeholder', '');
    });

    $('#passwordId').focusin(function () {
        var uPassword = $(this).val();

        if (uPassword == null || uPassword == '') {
            $(this).attr('Placeholder', 'Enter your password');
        }
    }).blur(function () {
        $(this).attr('Placeholder', '');
    });

    $('#submitId').click(function () {
        var uEmail = $('#emailId').val();
        var uPassword = $('#passwordId').val();

        $('#responseCarrier').hide();

        if (uEmail != '' && uPassword != '') {
            $(this).html('Please Wait, Logging...');
            $(this).attr('disabled', true);

            displayBorderColor('emailId');
            displayBorderColor('passwordId');
            
            // var url = 'https://gve.bonitasict.com/api/';
            // var url = 'https://gve-backend-api.herokuapp.com/api/admin/';
            var url = 'https://propertymanagementbict.herokuapp.com/api/admin/';
            

            $.ajax({
                type: "POST",
                url: `${url}login`,
                contentType: "application/json",
                data: JSON.stringify({
                    email: uEmail,
                    password: uPassword
                }),
                dataType: "json",
                success: function (response) {
                    var result = response;
                    var value  = result.message;
                    var tokenValue = result.token;
    
                    if(tokenValue != null || tokenValue != ''){
                        setCookie('loginToken', tokenValue);
                        display(value, 'white', 'green');
                        $('#submitId').html('Login');
                        $('#submitId').attr('disabled', false);
                    } else{
                        $('#submitId').html('Login');
                        $('#submitId').attr('disabled', false);
                    }
                },
                statusCode: {
                    404: function() {
                        display('This page is not found.', 'yellow', 'red');
                    },
                    400: function () {
                        displayResetPassword('Sorry, You are not yet authorized Or error occured.', 'yellow', 'red');
                    },
                    200: function () {
                        emptyField('#emailId');
                        emptyField('#passwordId');
                        setInterval(function () {
                            window.location.replace('index.html');
                        }, 3000);
                    },
                    401: function() {
                        display('Sorry, you are not authorized.', 'yellow', 'red');
                    },
                },
                complete: function(data){
                    console.log(data);
                    // if(data.readyState != 4){
                    //     display('Bad Network, Try Again.', 'yellow', 'red');
                    //     $('#submitId').html('Login');
                    //     $('#submitId').attr('disabled', false);
                    // }
                }
            });
        } else{
            var email = $('#emailId').val();
            var password = $('#passwordId').val();

            if (email == '' && password == '') {
                $('#emailId').css('border-color', 'red');
                $('#emailId').attr('Placeholder', 'Enter your Email address');

                $('#passwordId').css('border-color', 'red');
                $('#passwordId').attr('Placeholder', 'Enter your Password');

                messageDialog('Both of the fields are required', 'yellow', 'red');
            } else{

                if (email == '') {
                    $('#emailId').css('border-color', 'red');
                    $('#emailId').attr('Placeholder', 'Enter your Email address');

                    // messageDialog('Enter your Email address', 'yellow', 'red');
                } else {
                    $('#emailId').css('border-color', 'light-blue');
                }
                
                if(password == ''){
                    $('#passwordId').css('border-color', 'red');
                    $('#passwordId').attr('Placeholder', 'Enter your Password');

                    // messageDialog('Enter your Password', 'yellow', 'red');
                } else{
                    $('#passwordId').css('border-color', 'light-blue');
                }
            }
        }
    });
    
    

    $('#forgotPasswordEmail').focus(function () { 
        var forgotEmailAddress = $(this).val();

        if (forgotEmailAddress  == null || forgotEmailAddress == '') {
            $(this).attr('Placeholder', 'Enter your Email address');
        }
    }).blur(function () {
        $(this).attr('Placeholder', '');
    });

    $('#forgotPassword').click(function () { 
        var emailAddress = $('#forgotPasswordEmail').val();

        $('#responseCarrier').hide();

        if (emailAddress != '') {
            $(this).html('Please Wait, Verifying..');
            $(this).attr('disabled', true);

            displayBorderColor('forgotPasswordEmail');

            // var url = 'https://gve.bonitasict.com/api/';
           // var url = 'https://gve-backend-api.herokuapp.com/admin';
            var url = 'https://propertymanagementbict.herokuapp.com/admin';
            

            $.ajax({
                type: "POST",
                url: `${url}/forgot-password`,
                data: JSON.stringify({
                    email: emailAddress,
                }),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    var result = response;
                    var value  = result.message;

                    displayResetPassword(value, 'white', 'green');

                    $('#responseCarrier').show();

                    $('#forgotPassword').html('Reset New Password');
                    $('#forgotPassword').attr('disabled', false);
                },
                statusCode: {
                    404: function() {
                        displayResetPassword('This page is not found.', 'yellow', 'red');
                    },
                    200: function () {
                        displayMessageInForm('Successful, OTP sent to ' + emailAddress, 'green'); 
                        emptyField('#forgotPasswordEmail');
                        setInterval(function () {
                            window.location.replace('otp.html?' + emailAddress);
                        }, 3000);
                    },
                    400: function () {
                        displayMessageInForm('An error Occured in the process.', 'red');
                        displayResetPassword('An error Occured in the process.', 'yellow', 'red');
                    },
                    401: function () {
                        displayMessageInForm('You are not yet authorized.', 'red');
                        displayResetPassword('You are not yet authorized.', 'yellow', 'red');
                    }
                },
                complete: function(data){
                    if(data.readyState != 4){
                        displayResetPassword('Bad Network, Try Again.', 'yellow', 'red');
                        displayMessageInForm('Bad Network, Try Again.', 'red');
                    } else{
                        setCookie('forgotPasswordToken', data.responseJSON.token);
                        // console.log(data);
                    }
                }
            });
        } else{
            var email = $('#forgotPasswordEmail').val();

            if (email == '') {
                $('#forgotPasswordEmail').css('border-color', 'red');
                $('#forgotPasswordEmail').attr('Placeholder', 'Enter your Email address');

                messageDialog('Email Address is required to reset password', 'yellow', 'red');
                displayMessageInForm('Email Address is required to reset password', 'red');
            }
        }
    });
});