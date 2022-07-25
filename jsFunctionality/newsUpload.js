function getStorage(name) {
    return  localStorage.getItem(name);
}

function refresh() {
    setInterval(() => {
        window.location.reload();    
    }, 5000);
}

function redirect() {
    setInterval(() => {
        window.location.replace('AddNews.html');    
    }, 5000);
}

function emptyValue(id) {
    $(`#${id}`).val('');
}

var loginToken  = getStorage('loginToken');

function setValue(id, value) {
    $(`#${id}`).val(value);
}

function getValue(id) {
    return $(`#${id}`).val();
}

function isValidHttpUrl(string) {
    let url;
    let result;

    try {
        url = new URL(string);
        if (url.protocol === "http:" || url.protocol === "https:") {
            result = true;
        } else {
            result = false;
        }
    } catch (_) {
        result = false;
    }

    return result;
}

function addMessage(message, color, id) {
    $(`#${id}`).text(message).css('color', color);
    $('#messageBodyId').show();
}

function checkFeildIfEmpty(id, placeholder) {
    var value = $(`#${id}`).val();
    if (value.length == 0) {
        $(`#${id}`).addClass('background');
        $(`#${id}`).attr('placeholder', placeholder);
    } else {
        $(`#${id}`).removeClass('background');
    }
}

var list = [];

function editNewsById(newsNumber) {
    //var getNewsAPIEndPoint = `https://gve-backend-api.herokuapp.com/api/admin/news/editnews/${newsNumber}`;
    var getNewsAPIEndPoint = ` https://propertymanagementbict.herokuapp.com/api/admin/news/editnews/${newsNumber}`;
   
    
    var body = CKEDITOR.instances["newsContentId"].getData();
    var title = getValue('titleId');

    $.ajax({
        type: "PUT",
        url: `${getNewsAPIEndPoint}`,
        data: JSON.stringify(
            {
                'body': body,
                'title': title
            }
        ),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        complete: function (data) {
            console.log(data);
            var dataState = data.readyState;

            if(dataState != 4){
                btnAfterProcess('Edit News');
                addMessage(`Information: Error occured, please check your network`, 'red', 'messageId');
            } else{
                var state = data.status;
                var response = data.responseText;
                var object = JSON.parse(response);
                var value = object.message;
                var message = value.toUpperCase();

                if(state == 401){
                    btnAfterProcess('Edit News');
                    // addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                    // alertMessage(message, 'INFORMATION', 'alert-danger');
                    window.location.replace('login.html');
                } else if(state == 404){
                    btnAfterProcess('Edit News');
                    addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                    alertMessage(message, 'INFORMATION', 'alert-danger');
                } else if(state == 201){
                    btnAfterProcess('Edit News');
                    addMessage(`INFORMATION: ${message}`, 'green', 'messageId');
                    alertMessage(message, 'INFORMATION', 'alert-success');
                    // refresh();
                } else if(state == 200){
                    btnAfterProcess('Edit News');
                    addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                    alertMessage(message, 'INFORMATION', 'alert-success');
                } else if(state == 200){
                    btnAfterProcess('Edit News');
                    addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                    alertMessage(message, 'INFORMATION', 'alert-danger');
                }
            }
        }
    });
}

function btnWhenClicked(message) {
    $('#uploadNewsId').text(message);
    $('#uploadNewsId').attr('disabled', 'true');
}

function btnAfterProcess(message) {
    $('#uploadNewsId').text(message);
    $('#uploadNewsId').removeAttr('disabled');
}

function imgPreview(input) {
    var file = input.files[0];
    var mixedfile = file['type'].split("/");
    var filetype = mixedfile[0]; // (image, video)
    if (filetype == "image") {
        var reader = new FileReader();

        reader.onload = function (e) {
            list.push({ 'image': e.target.result, 'btnId': e.target.result });
            
            var element = e.target.result;
            
            $('#addPreviewId').append(`
                <ul style="position: relative; float: left;">
                        <img src="${element}" alt="" srcset="" id="imagePreviewId" height="50", width="50" style="padding= "10px;">
                </ul>
            `);
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        addMessage('Invalid file type*', 'red', 'messageId');
    }
}

function getCategoryDataFromServer(serverLink) {
    
    $.ajax({
        type: "GET",
        url: `${serverLink}`,
        dataType: "JSON",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        complete: function (data) {
            var dataState = data.readyState;

            if(dataState == 4){
                var response = JSON.parse(data.responseText);
                var responseArray = response['data'].rows;

                responseArray.forEach(element => {
                    $('#categoryListId').append(
                        `
                            <option value="${element.name}">${element.name}</option>
                        `
                    );
                });
            }
        }
    });
}

function getNewsDataForEditFromServer(serverLink) {
    
    $.ajax({
        type: "GET",
        url: `${serverLink}`,
        dataType: "JSON",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        complete: function (data) {
            var dataState = data.readyState;
            var state = data.status;

            if(dataState == 4 && state == 200){
                var response = JSON.parse(data.responseText);
                var responseArray = response['data'];

                CKEDITOR.instances["newsContentId"].setData(responseArray.body);

                setValue('titleId', responseArray.title);

                console.log(data);
            } else{
                window.location.replace('AddNews.html');
            }
        }
    });
}

function removeTags(id) {
    $(`#${id}`).remove();
}

function alertMessage(message, messageMood, cssClass) {
    $('#messageText').text(message);
    $('#messageMood').text(messageMood);
    $('#responseCarrier').addClass(cssClass);
    $('#responseCarrier').show();
    setInterval(() => {
        $('#responseCarrier').hide();
    }, 10000);
}

$(document).ready(function () {
    // Get the CKEDITOR Ready
    CKEDITOR.replace('newsContentId');

    // populate categories into select options
   // var getCategoriesAPIEndPoint = 'https://gve-backend-api.herokuapp.com/api/admin/category';
    var getCategoriesAPIEndPoint = 'https://propertymanagementbict.herokuapp.com/api/admin/category';
    
    getCategoryDataFromServer(getCategoriesAPIEndPoint);

    // check if there is a request to edit the news
    var location = window.location;
    var searchLink = new URLSearchParams(location.search);
    var edit = searchLink.get('edit');
    var newsNumber = searchLink.get('newsNumber');
    var slug = searchLink.get('slug');

    // var imgFiles;
    var imgFiles = [];
    
    var form_data = new FormData(document.getElementById('formId'));

    //var getSingleNewsAPIEndPoint = `https://gve-backend-api.herokuapp.com/api/admin/news/${slug}`;
    var getSingleNewsAPIEndPoint = `https://propertymanagementbict.herokuapp.com/api/admin/news/${slug}`;

    $('#messageBodyId').hide();
    
    $('#newsContentId').attr('Placeholder', 'Add News Articles...');
    
    var trending;

    $('#makeItTrendingId').click(function () {
        trending = $('#makeItTrendingId').prop('checked');
    });

    $("#imageSelectId").change(function () {
        var a = $(this)[0].files[0]['name'];
        console.log(a);
        var b = a.indexOf(['.']);
        var c = parseInt(b) + 1;
        var d = a.substring(c);
        console.log(d);
        if(d == 'jpg' || d == 'jpeg'){
            imgFiles.push($(this)[0].files[0]);
            // form_data.append('imageGallery', $('input[type=file]')[0].files[0]);
            console.log($('input[type=file]')[0].files[0]);
            imgPreview(this);
        } else{
            imgPreview(this);
        }
    });

    if(edit == 'on'){
        btnAfterProcess('Edit News');

        removeTags('seoSearchTermsId');
        removeTags('videoUrlId');
        removeTags('categoryListId');
        removeTags('imageSelectPreviewId');

        $('#postTagId').text('Edit New Post');

        getNewsDataForEditFromServer(`${getSingleNewsAPIEndPoint}`);

        // when the button is been clicked
        $('#uploadNewsId').click(function () {
            btnAfterProcess('Please wait, Editing News...');
            var editedTitle = getValue('titleId');
            var editedBody = CKEDITOR.instances["newsContentId"].getData();

            if(editedTitle.length > 0 && (editedBody != null || editedBody != '')){
                editNewsById(newsNumber);
            } else{
                addMessage(`Information: News title and body is required for editing*`, 'red', 'messageId');
            }
        });
    } else{
        $('#uploadNewsId').click(function () {
            // values of the fields
            var newsTitle = $('#titleId').val();
            var seoSearchTerms = $('#seoSearchTermsId').val();
            var videoURL = $('#videoUrlId').val();
            var newsArticle = CKEDITOR.instances["newsContentId"].getData();
            var categoryValue = $('#categoryListId').val();

            checkFeildIfEmpty('titleId', 'Enter News Title');
            checkFeildIfEmpty('seoSearchTermsId', 'Enter SEO Search Terms');
            checkFeildIfEmpty('videoUrlId', 'Enter Video URL');
            checkFeildIfEmpty('newsContentId', 'Add News Article');

            // validate if the values are empty or not
            if (newsTitle.length > 0 && seoSearchTerms.length > 0 && videoURL.length > 0 && newsArticle.length > 0) {
                btnWhenClicked('Please wait, uploading news...');
                // validate Video URL
                var link = isValidHttpUrl(videoURL);

                if (link != false) {
                    if(imgFiles.length > 0){
                        var featuredImage = imgFiles[0];

                        if(imgFiles.length > 1){
                            for (let index = 1; index < imgFiles.length; index++) {
                                form_data.append('imageGallery', imgFiles[index]);
                            }
                        } else{
                            form_data.append('imageGallery', imgFiles[0]);
                        }

                        form_data.append('featuredImage', featuredImage);
                        form_data.append('title', newsTitle);
                        // form_data.append('seoSearchTerms', seoSearchTerms);
                        // form_data.append('videoURL', videoURL);
                        form_data.append('body', newsArticle);
                        form_data.append('category', categoryValue);

                        $('#messageBodyId').hide();

                        for (let [key, value] of form_data) {
                            console.log(`${key}: ${value}`)
                        }

                       // var createNewsEndPoint = 'https://gve-backend-api.herokuapp.com/api/admin/news/createnews';
                        var createNewsEndPoint = 'https://propertymanagementbict.herokuapp.com/api/admin/news/createnews';

                        
                        $.ajax({
                            type: "POST",
                            url: `${createNewsEndPoint}`,
                            data: form_data,
                            enctype: 'multipart/form-data',
                            // cors: true,
                            // crossOrigin: true,
                            headers: {
                                'Authorization': `Bearer ${loginToken}`,
                            },
                            // beforeSend: function (xhr) {
                            //     xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
                            //     xhr.setRequestHeader('Access-Control-Request-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                            // },
                            // dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                            complete: function (data) {
                                console.log(data);
                                var dataState = data.readyState;
                    
                                if(dataState != 4){
                                    btnAfterProcess('Upload News');
                                    addMessage(`Information: Error occured, please check your network`, 'red', 'messageId');
                                } else{
                                    var state = data.status;
                                    var response = data.responseText;
                                    var object = JSON.parse(response);
                                    var value = object.message;
                                    var message = value.toUpperCase();

                                    if(state == 401){
                                        btnAfterProcess('Upload News');
                                        // addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                                        // alertMessage(`${message}`, 'INFORMATION:', 'alert-danger');
                                        window.location.replace('login.html');
                                    } else if(state == 404){
                                        btnAfterProcess('Upload News');
                                        addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                                        alertMessage(`${message}`, 'INFORMATION:', 'alert-danger');
                                    } else if(state == 201){
                                        btnAfterProcess('Upload News');
                                        addMessage(`INFORMATION: ${message}`, 'green', 'messageId');
                                        alertMessage(`${message}`, 'INFORMATION:', 'alert-success');
                                        $('#formId')[0].reset();
                                        CKEDITOR.instances["newsContentId"].setData('');
                                        refresh();
                                    } else{
                                        btnAfterProcess('Upload News');
                                        addMessage(`INFORMATION: ${message}`, 'red', 'messageId');
                                        alertMessage(`${message}`, 'INFORMATION:', 'alert-danger');
                                    }
                                }
                            }
                        });
                    } else{
                        btnAfterProcess('Upload News');
                        addMessage('No image selected*', 'red', 'messageId');
                    }
                } else {
                    btnAfterProcess('Upload News');
                    addMessage('The video URL is invalid*', 'red', 'messageId');
                }
            } else {
                btnAfterProcess('Upload News');
                addMessage('All the fields are required*', 'red', 'messageId');
            }
        });
    }
});