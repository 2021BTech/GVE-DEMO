var elementStart;

var index = -1;

var serialNumberContainer = [];

function getStorage(name) {
    return  localStorage.getItem(name);
}

var loginToken  = getStorage('loginToken');

console.log(loginToken);

function checkFeildIfEmpty(id, placeholder) {
    var value = $(`#${id}`).val();
    if (value.length == 0) {
        $(`#${id}`).addClass('emptyBoxWarning');
        $(`#${id}`).attr('placeholder', placeholder);
    } else {
        $(`#${id}`).removeClass('emptyBoxWarning');
    }
}

function getValue(id) {
    return $(`#${id}`).val();
}

function setValue(id, value) {
    $(`#${id}`).val(value);
}

function emptyValue(id) {
    $(`#${id}`).val('');
}

function btnWhenClicked(id,message) {
    $(`#${id}`).text(message);
    $(`#${id}`).attr('disabled', 'true');
}

function btnAfterProcess(id, message) {
    $(`#${id}`).text(message);
    $(`#${id}`).removeAttr('disabled');
}

function displayMessage(message, color) {
    $('#displayId').hide();
    $('#displayId').text(`${message}`).css('color', `${color}`);
    $('#displayId').show();
}

function editCat(id, value) {
    var url = 'AddCat.html';
    var link = `${url}?edit=on&catValue=${value}&catId=${id}`;
    console.log(link);
    window.location.replace(`${link}`)
}

function sendAjaxForDelete(id, rowId, name) {
    // var url = `https://gve-backend-api.herokuapp.com/api/admin/category/deletecategory/${name}`;
    var url = `https://propertymanagementbict.herokuapp.com/api/admin/category/deletecategory/${name}`;

    $.ajax({
        type: "DELETE",
        url: `${url}`,
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
            xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
        },
        complete: function (data) {
            var dataState = data.readyState;
            console.log(data);
            var object = JSON.parse(data.responseText);
            console.log(object);
            if(dataState == 4){
                var state  = data.status;
                if(state == 200){
                    if(object.status == true){
                        $(`#${rowId}`).remove();
                        alertMessage(`Successful deletion of category`, 'Message: ', 'alert-success');
                        displayMessage(`Information: ${object.message} deletion of category`, 'green');
                    } else{
                        alertMessage(`Failed to delete category`, 'Message: ', 'alert-danger');
                        displayMessage(`Information: ${object.message}`, 'green');
                    }
                } else if(state == 401) {
                    window.location.replace('login.html');
                }
            } else{
                alertMessage(`Failed to delete category`, 'Message: ', 'alert-danger');
            }
        }
    });
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

function getSelectedValue(id, catId, catValue, catRowId) {
    var selectedValue;
    console.log(selectedValue);
    $(`#${id}`).on('change',function () {  
        selectedValue = this.value;
    });

    if(selectedValue == 'Edit'){
        editCat(catId, catValue);
    } else{
        sendAjaxForDelete(catId, catRowId);
    }
}

function getDataFromServer(serverLink) {

    displayProcessingInTable('Please wait, processing...', 'green');

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
                var status = data.status;

                if(status != 401){
                    showTable();
                
                    var response = JSON.parse(data.responseText);
                    var responseArray = response['data'].rows;

                    responseLength = response['data'].count;

                    var elementToBeSorted = [];
    
                    for (let i = 1; i <= responseLength; i++) {
                        elementToBeSorted.push(i);
                    }

                    elementStart = 1;

                    for (let a = elementStart; a <= elementToBeSorted.length; a++) {
                        serialNumberContainer.push(a);
                    }

                    var itemsObject = [];
    
                    responseArray.forEach(element => {
                        var dateFromServer = element.updatedAt;
                        var characterIndex = dateFromServer.indexOf('T');
                        var targetedIndex = characterIndex;
                        var formatedDate = dateFromServer.substring(0, targetedIndex);
    
                        itemsObject.push(
                            {
                                'element': {
                                    'date' : formatedDate,
                                    'id': element.id,
                                    'title' : element.name,
                                    'length' : element.NewsFeeds.length,
                                },
                                'serialNumber' : serialNumberContainer
                            } 
                        );
                    });

                    itemsObject.forEach(element => {
                        var date = element.element['date'];
                        var id = element.element['id'];
                        var title = element.element['title'];
                        var length = element.element['length'];

                        var serialNumber = element.serialNumber;

                        index++;
                        
                        $('#tableBody').append(
                            `
                                <tr id="row${id}">
                                    <td data-title="num">${serialNumber[index]}</td>
                                    <td data-title="datePosted">${date}</td>
                                    <td data-title="newsTitle">${title}</td>
                                    <td data-title="newscat">${length}</td>
                                    <td>
                                        <div class="dropdown">
                                            <span><i class="arrow down"></i></span>
                                                <div class="dropdown-content">
                                                    <p id="edit${id}" onclick="editCat('edit${id}', '${title}')">Edit</p>
                                                    <p id="delete${id}" onclick="sendAjaxForDelete('delete${id}', 'row${id}', '${title}')">Delete</p>
                                                </div>
                                        </div>
                                    <td>
                                </tr>   
                            `
                        );
                    });                    
                } else{
                    window.location.replace('login.html');
                }
            } else{
                displayProcessingInTable(`Information: Error occured, check your network`, 'red');
                alertMessage(`Error occured, check your network`, 'Message: ', 'alert-danger');
            }
        }
    });
}

function displayProcessingInTable(data, color) {
    // show the table
    $('table').hide();

    $('#processingMessage').html(
        `
            <p>${data}</p>
        `
    ).css('text-align', 'center').css('color', color).show();
}

function showTable() {
    $('table').show();
    $('#processingMessage').hide();
}

$(document).ready(function () {

    var link = window.location;
    var url = new URLSearchParams(link.search);
    var isEdit = url.get('edit');
    var catValue = url.get('catValue');
    var catId = url.get('catId');

    var fileToUpload = new FormData();

    // var getCategoryServerPath = 'https://gve-backend-api.herokuapp.com/api/admin/category';
    var getCategoryServerPath = 'https://propertymanagementbict.herokuapp.com/api/admin/category';

    if(isEdit == 'on'){
        $('#categoryTagId').text('Edit Category');

        btnAfterProcess('addCategoryTitleId', 'Edit Category');
        
        getDataFromServer(getCategoryServerPath);

        setValue('categoryTitleId', catValue);

        $('#addCategoryTitleId').click(function () { 
            var cat = getValue('categoryTitleId');
            var category = cat.trim();
            
            checkFeildIfEmpty('categoryTitleId', 'Edit category');

            if(category.length > 0){
                btnWhenClicked('addCategoryTitleId','Please wait, Editing category...');

                var trimCatValue = catValue.trim();

                // var serverLink = `https://gve-backend-api.herokuapp.com/api/admin/category/editcategory/${trimCatValue}`;
                var serverLink = `https://propertymanagementbict.herokuapp.com/api/admin/category/editcategory/${trimCatValue}`;

                $.ajax({
                    type: "PUT",
                    url: `${serverLink}`,
                    data: JSON.stringify(
                        {
                            'name': category
                        }
                    ),
                    contentType: 'application/json',
                    cors: true,
                    headers: {
                        'Authorization': `Bearer ${loginToken}`,
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
                        xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
                    },
                    complete: function (data) {
                        var dataState = data.readyState;
            
                        if(dataState != 4){
                            btnAfterProcess('addCategoryTitleId', 'Edit Category');
                            displayMessage(`Information: Bad Network, Try again later`, 'red');
                            alertMessage(`Bad Network, Try again later`, 'Message: ', 'alert-danger');
                        } else{
                            var state = data.status;
                            var response = data.responseText;
                            var object = JSON.parse(response);

                            var value = object.message;
                            var message = value.toUpperCase();

                            if(state == 401){
                                btnAfterProcess('addCategoryTitleId', 'Edit Category');
                                // displayMessage(`INFORMATION: ${message}`, 'red');
                                // alertMessage(` ${message}`, 'Message: ', 'alert-danger');
                                window.location.replace('login.html');
                            } else if(state == 200){
                                btnAfterProcess('addCategoryTitleId', 'Edit Category');
                                displayMessage(`INFORMATION: ${message}`, 'green');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                                emptyValue('categoryTitleId');
                            } else if(state == 201){
                                btnAfterProcess('addCategoryTitleId', 'Edit Category');
                                displayMessage(`INFORMATION: ${message}`, 'green');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                                emptyValue('categoryTitleId');
                            } else if(state == 404){
                                btnAfterProcess('addCategoryTitleId', 'Edit Category');
                                displayMessage(`INFORMATION: ${message}`, 'red');
                                alertMessage(`${message}`, 'Message: ', 'alert-danger');
                            } else{
                                btnAfterProcess('addCategoryTitleId', 'Edit Category');
                                displayMessage(`INFORMATION: ${message}`, 'red');
                                alertMessage(`${message}`, 'Message:', 'alert-danger');
                            }
                        }
                    }
                });
            } else{
                displayMessage('Information: Fill in the necessary details please', 'red');
                alertMessage(`Fill in the necessary details please`, 'Message: ', 'alert-danger');
            }
        });

    } else{
        getDataFromServer(getCategoryServerPath);
        $('#addCategoryTitleId').click(function () { 
            var cat = getValue('categoryTitleId');
            var category = cat.trim();
            
            checkFeildIfEmpty('categoryTitleId', 'Enter new category');
            
            if(category.length > 0){

                // var serverURL = 'https://gve-backend-api.herokuapp.com/api/admin/category/createcategory';
                var serverURL = 'https://propertymanagementbict.herokuapp.com/api/admin/category/createcategory';
                
                btnWhenClicked('addCategoryTitleId','Please wait, Adding category...');
                
                fileToUpload.append('name', category);

                $.ajax({
                    type: "POST",
                    url: `${serverURL}`,
                    data: JSON.stringify(
                        {
                            'name': category
                        }
                    ),
                    contentType: 'application/json',
                    cors: true,
                    headers: {
                        'Authorization': `Bearer ${loginToken}`,
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
                        xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
                    },
                    complete: function (data) {
                        var dataState = data.readyState;
            
                        if(dataState != 4){
                            btnAfterProcess('addCategoryTitleId', 'Add Category');
                            displayMessage(`Information: Bad Network, Try again later`, 'red');
                        } else{
                            var state = data.status;
                            var response = data.responseText;
                            var object = JSON.parse(response);
                            var messObject = object.message;
                            var message = messObject.toUpperCase();

                            if(state == 401){
                                btnAfterProcess('addCategoryTitleId', 'Add Category');
                                // displayMessage(`INFORMATION: ${message}`, 'red');
                                // alertMessage(`INFORMATION: ${message}`, 'Message', 'alert-danger');
                                window.location.replace('login.html');
                            } else if(state == 200){
                                btnAfterProcess('addCategoryTitleId', 'Add Category');
                                displayMessage(`INFORMATION: ${message}`, 'green');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                                emptyValue('categoryTitleId');
                            } else if(state == 201){
                                btnAfterProcess('addCategoryTitleId', 'Add Category');
                                displayMessage(`INFORMATION: ${message}`, 'green');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                                emptyValue('categoryTitleId');
                            } else if(state == 404){
                                btnAfterProcess('addCategoryTitleId', 'Add Category');
                                displayMessage(`INFORMATION: ${message}`, 'red');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                            } else{
                                btnAfterProcess('addCategoryTitleId', 'Add Category');
                                displayMessage(`INFORMATION: ${message}`, 'red');
                                alertMessage(`${message}`, 'Message: ', 'alert-success');
                            }
                        }
                    }
                });
            } else{
                displayMessage('Information: Fill in the necessary details please', 'red');
                alertMessage(`Fill in the necessary details please`, 'Message: ', 'alert-danger');
            }
        });
    }
});