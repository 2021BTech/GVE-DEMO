function setStorage(name,value) {
    localStorage.setItem(name, value);
}

function getStorage(name) {
    return  localStorage.getItem(name);
}

function timeOutdisplay() { 
    setInterval(function () {  
        $('#responseCarrier').hide();
    }, 10000);
}

function emptyField(fieldId) {
    $(fieldId).val('');
}

function messageDialog(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    timeOutdisplay();
}

function display(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#verifyButtonId').html('Verify');
    $('#verifyButtonId').attr('disabled', false);
    timeOutdisplay();
}

function informationDisplay(information, color) { 
    $('#informationId').html(information).css('color', color).css('font-weight', 'bold');
}

function displayResend(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#resendCode').html('Resend');
    $('#resendCode').attr('disabled', false);
    timeOutdisplay();
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

$(document).ready(function () {

    var emailAddress = location.search.substring(1);

    if (!validateEmail(emailAddress)) {
        setInterval(function () {  
            window.location.replace('login.html');
        }, 1000);
    }

    var forgotPasswordToken  = getStorage('forgotPasswordToken');

    if(forgotPasswordToken == '' || forgotPasswordToken == undefined || forgotPasswordToken == null){
        setInterval(function () {  
            window.location.replace('login.html');
        }, 1000);
    }

    $('#resendTimeId').hide();
    $('#responseCarrier').hide();
    
    // taking the time as 1 minute

    var minutes = 1;

    var t = minutes * 60 ;
    
    var s = 1;

    var firstInput = $('#firstInputFieldId').val();
    var secondInput = $('#secondInputFieldId').val();
    var thirdInput = $('#thirdInputFieldId').val();
    var fourthInput = $('#fourthInputFieldId').val();

    if (firstInput == '' || secondInput == '' || thirdInput == '' || fourthInput == '') {
        var min;
        if (minutes == 1) {
            min = 'minute';
        } else{
            min = 'minutes';
        }

        informationDisplay(`Enter OTP sent to your email address <br> OTP expires after ${minutes} ${min}.`, 'black');
        $('#verifyButtonId').attr('disabled', true);
    }

    setInterval(function () {
        t -= s;
        if (t <= 0) {
            $('#resendCode').attr('disabled', false).css('color', 'white');

            informationDisplay('Sorry OTP have Expired, try resending another.', 'red');
            $('#resendTimeId').html('Time out').show();  
            $('#verifyButtonId').attr('disabled', true);
            $('#resendCode').attr('disabled', false); 
            $('#verifyButtonId').css('background-color', 'grey');
        } else{
            $('#verifyButtonId').css('background-color', 'green');
            $('#resendCode').attr('disabled', true);
            $('#resendTimeId').html(t + ' Seconds Remaining').show();
        }
    }, 1000);

    $('#firstInputFieldId').focus(function () {  

        $('#secondInputFieldId').attr('disabled', true);
        $('#thirdInputFieldId').attr('disabled', true);
        $('#fourthInputFieldId').attr('disabled', true);
        
        $('#verifyButtonId').attr('disabled', true);

        $('#firstInputFieldId').keyup(function () { 
            var thisValue = $(this).val();
            $(this).attr('maxlength', 1);

            if (thisValue == '') {
                $('#secondInputFieldId').attr('disabled', true);
                $('#thirdInputFieldId').attr('disabled', true);
                $('#fourthInputFieldId').attr('disabled', true);
            } else{
                $('#secondInputFieldId').attr('disabled', false);
            }
        });
        
    }).blur(function () { 
        var inputField = $('#firstInputFieldId').val();

        if (inputField == '') {
            $('#secondInputFieldId').attr('disabled', true);
            $('#thirdInputFieldId').attr('disabled', true);
            $('#fourthInputFieldId').attr('disabled', true);
        } else{
            $(this).next().attr('disabled', false);
        }
    });

    // second input field
    $('#secondInputFieldId').focus(function () { 
        var firstValue =  $('#firstInputFieldId').val();

        if(firstValue === ''){
            $('#secondInputFieldId').attr('disabled', true);
        }

        $('#thirdInputFieldId').attr('disabled', true);
        $('#fourthInputFieldId').attr('disabled', true);

        $('#verifyButtonId').attr('disabled', true);
        
        $('#secondInputFieldId').keyup(function () { 
            var thisValue = $(this).val();
            $(this).attr('maxlength', 1);

            if (thisValue == '') {
                $('#thirdInputFieldId').attr('disabled', true);
                $('#fourthInputFieldId').attr('disabled', true);
            } else{
                $('#thirdInputFieldId').attr('disabled', false);
            }
        });
        
    }).blur(function () { 
        var inputField = $('#secondInputFieldId').val();

        if (inputField == '') {
            $('#thirdInputFieldId').attr('disabled', true);
            $('#fourthInputFieldId').attr('disabled', true);
        } else{
            $(this).next().attr('disabled', false);
        }
    });

    // third input field
    $('#thirdInputFieldId').focus(function () {

        var firstValue =  $('#firstInputFieldId').val();
        var secondValue =  $('#secondInputFieldId').val();

        if(firstValue == '' || secondValue == ''){
            $('#thirdInputFieldId').attr('disabled', true);
        }

        $('#fourthInputFieldId').attr('disabled', true);

        $('#verifyButtonId').attr('disabled', true);
        
        $('#thirdInputFieldId').keyup(function () { 
            var thisValue = $(this).val();
            $(this).attr('maxlength', 1);

            if (thisValue == '') {
                $('#fourthInputFieldId').attr('disabled', true);
            } else{
                $('#fourthInputFieldId').attr('disabled', false);
            }
        });
        
    }).blur(function () { 
        var inputField = $('#thirdInputFieldId').val();

        if (inputField == '') {
            $('#fourthInputFieldId').attr('disabled', true);
        } else{
            $(this).next().attr('disabled', false);
        }
    });

    // fourth input field
    $('#fourthInputFieldId').focus(function () { 

        var firstValue =  $('#firstInputFieldId').val();
        var secondValue =  $('#secondInputFieldId').val();
        var thirdValue =  $('#thirdInputFieldId').val();
        
        if(firstValue == '' || secondValue == '' || thirdValue == ''){
            $('#fourthInputFieldId').attr('disabled', true);
        }
        
        $('#verifyButtonId').attr('disabled', true);

        $('#fourthInputFieldId').keyup(function () { 
            var thisValue = $(this).val();
            $(this).attr('maxlength', 1);

            if (thisValue == '') {
                $('#verifyButtonId').attr('disabled', true); 
            } else{
                $('#verifyButtonId').attr('disabled', false); 
            }
        });
        
    }).blur(function () { 
        var inputField = $('#fourthInputFieldId').val();

        if (inputField == '') {
            $('#verifyButtonId').attr('disabled', true); 
        } else{
            $('#verifyButtonId').attr('disabled', false); 
        }
    });

    // the verification button
    $('#verifyButtonId').click(function () { 
        var firstInput = $('#firstInputFieldId').val();
        var secondInput = $('#secondInputFieldId').val();
        var thirdInput = $('#thirdInputFieldId').val();
        var fourthInput = $('#fourthInputFieldId').val();

        if (firstInput == '' || secondInput == '' || thirdInput == '' || fourthInput == '') {
            informationDisplay('Enter OTP sent to your email address <br> OTP expires after ' + minutes + ' minutes.', 'red');
            messageDialog('Enter OTP sent to your email address. OTP expires after ' + minutes + ' minutes.', 'white', 'green');
        } else{
            $(this).attr('disabled', true);
            $(this).html('Please wait, verifying OTP ...');

            var otpValue = firstInput + secondInput + thirdInput + fourthInput;

            // var url = 'https://gve.bonitasict.com/api/';
            //var url = 'https://gve-backend-api.herokuapp.com/admin/';
            var url = 'https://propertymanagementbict.herokuapp.com/admin/';
           

            $.ajax({
                type: "POST",
                url: `${url}forgot-password/otp`,
                contentType: "application/json",
                data: JSON.stringify(
                    {
                        otp : otpValue
                    }
                ),
                headers: {
                    'Authorization': `Bearer ${forgotPasswordToken}`,
                },
                dataType: "json",
                success: function (response) {
                    var result = response;
                    var value  = result.message;

                    display(value, 'white', 'green');
                },
                statusCode: {
                    404: function() {
                        display('This page is not found.', 'yellow', 'red');
                    },
                    200: function () {  
                        emptyField('#firstInputFieldId');
                        emptyField('#secondInputFieldId');
                        emptyField('#thirdInputFieldId');
                        emptyField('#fourthInputFieldId');

                        informationDisplay('OTP Vaildation succeed.', 'green');

                        setInterval(function () {  
                            window.location.replace('resetpassword.html');
                        }, 3000);
                    },
                    400: function () {
                        emptyField('#firstInputFieldId');
                        emptyField('#secondInputFieldId');
                        emptyField('#thirdInputFieldId');
                        emptyField('#fourthInputFieldId');
                        informationDisplay('OTP Vaildation Failed, Or Used.', 'red');
                        display('OTP Vaildation Failed, Or Used.', 'yellow', 'red');
                    },
                    401: function () {  
                        informationDisplay('Sorry, you are not authorized.', 'red');
                        display('Sorry, you are not authorized.', 'yellow', 'red');
                    },
                },
                complete: function(data){
                    if(data.readyState != 4){
                        informationDisplay('Bad Network, Try Again.', 'red');
                        display('Bad Network, Try Again.', 'yellow', 'red');
                    } else{
                        // console.log(data.responseJSON.token);
                        setStorage('cacheToken', data.responseJSON.token);
                    }
                }
            });
        }
    });

    // resend OTP button functionality
    $('#resendCode').click(function () {
        t = minutes * 60;

        var emailAddress = location.search.substring(1);

        $.ajax({
            type: "POST",
            url: "https://propertymanagementbict.herokuapp.com/api/forgot-password",
            contentType: "application/json",
            data: JSON.stringify({
                email: emailAddress,
            }), 
            dataType: "json",
            success: function (response) {
                var result = response;
                var value  = result.message;

                displayResend(value, 'white', 'green');
            },
            statusCode: {
                404: function() {
                    displayResend('This page is not found.', 'yellow', 'red');
                },
                200: function () {  
                    displayResend('Another OTP has been sent to your email.', 'white', 'green');
                    informationDisplay('Another OTP has been sent to your email.', 'green');
                },
                400: function () {  
                    informationDisplay('Resending OTP Failed.', 'red');
                    displayResend('Resending OTP Failed', 'yellow', 'red');
                }
            },
            complete: function(data){
                if(data.readyState != 4){
                    informationDisplay('Bad Network, Try Again.', 'red');
                    displayResend('Bad Network, Try Again.', 'yellow', 'red');
                }
            }
        });
    });
});