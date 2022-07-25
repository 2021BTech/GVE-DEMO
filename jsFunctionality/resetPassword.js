function getStorage(name) {
   return  localStorage.getItem(name);
}

function timeOutdisplay() { 
    setInterval(function () {  
        $('#responseCarrier').hide();
    }, 10000);
}

function display(message, cssClass, background) {  
    $('#messageMood').text('Information: ');
    $('#messageText').text(message);
    $('#responseCarrier').css('color', cssClass).css('background-color', background);
    $('#responseCarrier').show();
    $('#resetPasswordId').html('Reset');
    $('#resetPasswordId').attr('disabled', false);
    timeOutdisplay();
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

function displayBorderColor(idCode) { 
    $(`#${idCode}`).css('border-color', 'light-blue');
}

$(document).ready(function () {

    var token  = getStorage('cacheToken');

    if(token == '' || token == undefined || token == null){
        setInterval(function () {  
            window.location.replace('login.html');
        }, 1000);
    }

    $('#responseCarrier').hide();

    $('input:password').focus(function () {

        if ($(this).val() == '') {
            $('#passwordId').attr('placeholder', 'Enter your new Password');
            $('#repeatpasswordId').attr('placeholder', 'ReType new Password');
        } 

        $(this).keyup(function () { 
            var thisValue = $(this).val();

            if (thisValue == '') {
                $('#passwordId').attr('placeholder', 'Enter your new Password');
                $('#repeatpasswordId').attr('placeholder', 'ReType new Password');
            }
        });
        
    }).blur(function () { 
        var inputField = $('input:password').val();

        if (inputField == '') {
            $('#passwordId').attr('placeholder', 'Enter your new Password');
            $('#repeatpasswordId').attr('placeholder', 'ReType new Password'); 
        } else{
            $(this).next().attr('disabled', false);
        }
    });

    // the reset button
    $('#resetPasswordId').click(function () { 
        var password = $('#passwordId').val();
        var repeatPassword = $('#repeatpasswordId').val();

        // check if any of the fields is empty
        if (password == '' || repeatPassword == '') {
            messageDialog('Both fields are required to be filled.', 'yellow', 'red');
            if(repeatPassword == ''){
                $('#repeatpasswordId').css('border-color', 'red').attr('placeholder', 'ReType new Password');
            } else {
                $('#repeatpasswordId').css('border-color', 'light-blue');
            }

            if(password == ''){
                $('#passwordId').css('border-color', 'red').attr('placeholder', 'Enter your new Password');
            } else{
                $('#passwordId').css('border-color', 'light-blue');
            }
        } else{
            displayBorderColor('repeatpasswordId');
            displayBorderColor('passwordId');
            // checking if the passwords matched
            if(password == repeatPassword){

                $(this).attr('disabled', true);
                $(this).html('Please wait, Resetting password ...');

                // var url = 'https://gve.bonitasict.com/api/';
                //var url = 'https://gve-backend-api.herokuapp.com/admin/';
                var url = 'https://propertymanagementbict.herokuapp.com/admin/';

                $.ajax({
                    type: "POST",
                    url: `${url}set-password`,
                    contentType: "application/json",
                    data: JSON.stringify(
                        {
                            newPassword : password,
                            retypeNewPassword: repeatPassword
                        }
                    ),
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
                            emptyField('#passwordId');
                            emptyField('#repeatpasswordId');

                            setInterval(function () {  
                                window.location.replace('login.html');
                            }, 3000);
                        },
                        400: function () {  
                            display('Operation failed', 'yellow', 'red');
                        },
                        401: function () { 
                            display('You are not unauthorized', 'yellow', 'red');
                        }
                    },
                    complete: function(data){
                        if(data.readyState != 4){
                            display('Bad Network, Try Again.', 'yellow', 'red');
                        }
                    }
                });
            } else{
                messageDialog('Passwords Mismatched.', 'yellow', 'red');
            }
        }
    });
});