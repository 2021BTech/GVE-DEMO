var lastIndexOfLoop;
var beginningIndexOfLoop = 0;

var result;

var responseLength;

var tRowLimit = 5;

var nextIndex = 0;

var endIndex;

var elementStart;

var index = -1;

var serialNumberContainer = [];

var date = null;

function getStorage(name) {
    return  localStorage.getItem(name);
}

var loginToken  = getStorage('loginToken');

function unpublishNews(btnId, articleId) {
    //var serverLink = 'https://gve-backend-api.herokuapp.com/api/admin/news/movenews';
    var serverLink = 'https://propertymanagementbict.herokuapp.com/api/admin/news/movenews';

    console.log(btnId);

    $.ajax({
        type: "PUT",
        url: `${serverLink}/${articleId}?action=true`,
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
            xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
        },
        complete: function (data) {  
            var dataState = data.readyState;
            var object = JSON.parse(data.responseText);
            console.log(object);
            var objectMessage = object.message;
            var message = objectMessage.toLocaleUpperCase();

            if(dataState == 4){
                var state  = data.status;
                if(state == 200){
                    if(object.status == true){
                        $(`#${btnId}`).text('Publish').attr('onclick', `publishNews('${btnId}', '${articleId}')`);
                        alertMessage(`Article unpublished successfully`, 'Message', 'alert-success');
                        displayMessage(`Information: ${message} ON ARTICLE`, 'green');
                    } else{
                        alertMessage(`Unpublished of article failed`, 'Message', 'alert-danger');
                        displayMessage(`Information: ${message} ON ARTICLE`, 'green');
                    }
                } else{
                    alertMessage(`Information: ${object.message}`, 'Message', 'alert-danger');
                    displayMessage(`Information: ${message}`, 'green');
                }
            } else{
                alertMessage(`Check network please`, 'Message', 'alert-danger');
            }
        },
    });
}

function publishNews(btnId, articleId) {
    //var serverLink = 'https://gve-backend-api.herokuapp.com/api/admin/news/movenews';
    var serverLink = 'https://propertymanagementbict.herokuapp.com/api/admin/news/movenews';

    console.log(btnId);

    $.ajax({
        type: "PUT",
        url: `${serverLink}/${articleId}?action=false`,
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
            xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
        },
        complete: function (data) {  
            var dataState = data.readyState;
            var object = JSON.parse(data.responseText);
            console.log(object);
            var objectMessage = object.message;
            var message = objectMessage.toLocaleUpperCase();

            if(dataState == 4){
                var state  = data.status;
                if(state == 200){
                    if(object.status == true){
                        $(`#${btnId}`).text('Unpublish').attr('onclick', `unpublishNews('${btnId}', '${articleId}')`);
                        alertMessage(`Article published successfully`, 'Message', 'alert-success');
                        displayMessage(`Information: ${message} ON ARTICLE`, 'green');
                    } else{
                        alertMessage(`Article failed to published`, 'Message', 'alert-danger');
                        displayMessage(`Information: ${message} ON ARTICLE`, 'green');
                    }
                } else{
                    alertMessage(`Information: ${object.message}`, 'Message', 'alert-danger');
                    displayMessage(`Information: ${message}`, 'green');
                }
            } else{
                alertMessage(`Check network please`, 'Message', 'alert-danger');
            }
        },
    });
}

function editNews(newsNumber, slug) {
    window.location.replace(`addNews.html?newsNumber=${newsNumber}&edit=on&slug=${slug}`);
}

function deleteNews(newsNumber, rowId) {
    //var serverLink = `https://gve-backend-api.herokuapp.com/api/admin/news/deletenews/${newsNumber}`;
    var serverLink = `https://propertymanagementbict.herokuapp.com/api/admin/news/deletenews/${newsNumber}`;
    $.ajax({
        type: "DELETE",
        url: `${serverLink}`,
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
            xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
        },
        complete: function (data) {  
            var dataState = data.readyState;
            var object = JSON.parse(data.responseText);
            console.log(object);
            var objectMessage = object.message;
            var message = objectMessage.toLocaleUpperCase();

            if(dataState == 4){
                // $(`#${rowId}`).remove();
                var state  = data.status;
                if(state == 200){
                    if(object.status == true){
                        $(`#${rowId}`).remove();
                        alertMessage(`Successful deletion of news`, 'Message', 'alert-success');
                        displayMessage(`Information: ${message}`, 'green');
                    } else{
                        alertMessage(`Failed to delete news`, 'Message:', 'alert-danger');
                        displayMessage(`Information: ${message}`, 'green');
                    }
                } else{
                    alertMessage(`Information: ${object.message}`, 'Message', 'alert-danger');
                    displayMessage(`Information: ${message}`, 'green');
                }
            } else{
                alertMessage(`Failed to delete news`, 'Message', 'alert-danger');
            }
        },
    });
}

function getNumberOfButtons(rLength, r){
    result = Math.ceil(rLength / r);
    return result;
}

function customLoopOfButtons(beginning, end){
    console.log(result);
    // new table row length
    newTableRowLimit();

    // date picked
    newDate();

    if (beginning <= result) {
        for (let i = beginning; i <= end; i++) {
            if(i >= 1){
                if(i <= end){
                    if(i == beginning){
                        beginningIndexOfLoop = i;
                    } else if(i == end){
                        lastIndexOfLoop = i;
                    }
                    
                    $('#button').append(
                        `
                            <button id="${i}" onClick="getResultBaseOnButtonId('${i}', '${tRowLimit}')">${i}</button>
                        `
                    ).css('float', 'left');
                }
            }
        }   
    } else{
        console.log('oops');
    }
}

function nextButtons() {
    console.log('new begin ' + beginningIndexOfLoop);
    console.log('new last ' + lastIndexOfLoop);
    console.log(result);

    // new table row length
    newTableRowLimit();

    // date picked
    newDate();

    var end = parseInt(lastIndexOfLoop) + tRowLimit;
    console.log(beginningIndexOfLoop);

    if(end <= result ){
        // Logic of the button
        logicHandler();

        var beginning = parseInt(lastIndexOfLoop) + 1;

        customLoopOfButtons(beginning, end);

    } else{
        console.log('News Length reached');
    }
}

function previousButtons() {
    console.log('previous ' + beginningIndexOfLoop);
    console.log('previous ' + lastIndexOfLoop);

    // new table row length
    newTableRowLimit();

    // date picked
    newDate();

    if(beginningIndexOfLoop > tRowLimit){
        if(lastIndexOfLoop <= result){
            logicHandler();

            var beginning = beginningIndexOfLoop - tRowLimit;
            var end = lastIndexOfLoop - tRowLimit;

            customLoopOfButtons(beginning, end);
        } else{
            console.log('News Length reached');
        }
    } else{
        console.log('Can\'t go back.');
    }
}

function populateDataIntoTableFromServer(pageNumber, limit, date) {
    //var url = 'https://gve-backend-api.herokuapp.com/api/admin/news/';
    var url = 'https://propertymanagementbict.herokuapp.com/api/admin/news/';
    newTableRowLimit();
    limit = tRowLimit;

    // date picked
    newDate();

    // hide the table when requesting is been made
    displayProcessingInTable('Please wait, Processing...', 'green');

    if(date == null){
        $.ajax({
            type: "GET",
            url: `${url}?page=${pageNumber}&limit=${limit}`,
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
                    displayProcessingInTable('Error occured, check your internet connection', 'red');
                } else{
                    var state = data.status;
    
                    if(state == 200){
                        // show the table
                        showTable();
    
                        var object = JSON.parse(data.responseText);
                        var objectArray = object['data'].rows;
    
                        responseLength = object['data'].count;
    
                        var elementToBeSorted = [];
    
                        for (let i = 1; i <= responseLength; i++) {
                            elementToBeSorted.push(i);
                        }
    
                        if(pageNumber == 1){
                            elementStart = 1;
                        } else{
                            elementStart = ((pageNumber - 1) * limit) + 1;
                        }
    
                        for (let a = elementStart; a <= elementToBeSorted.length; a++) {
                            var condition = pageNumber * limit;
                            if(a <= condition){
                                serialNumberContainer.push(a);
                            }
                        }
    
                        console.log(object['data']);
                        console.log(responseLength);
                        console.log(serialNumberContainer);
    
                        var itemsObject = [];
    
                        objectArray.forEach(element => {
                            var dateFromServer = element.createdAt;
                            var characterIndex = dateFromServer.indexOf('T');
                            var targetedIndex = characterIndex;
                            var formatedDate = dateFromServer.substring(0, targetedIndex);
                            
                            if(pageNumber == 1){
                                ++nextIndex;
                                sortIndex = nextIndex;
                                endIndex = limit;
                            } else{
                                sortIndex = 0;
                            }
    
                            var categoryName;
    
                            if(element.Category != null){
                                categoryName = element.Category.name;
                                console.log(element.Category.name);
                            } else{
                                categoryName = 'Not Assigned';
                            }
    
                            var draft = element.draft;
    
                            itemsObject.push(
                                {
                                    'element': {
                                        'date' : formatedDate,
                                        'id': element.id,
                                        'title' : element.title,
                                        'category' : categoryName,
                                        'slug' : element.slug,
                                        'draft': element.draft,
                                    },
                                    'serialNumber' : serialNumberContainer
                                } 
                            );
                        });
                        console.log(itemsObject);
    
                        itemsObject.forEach(element => {
                            var date = element.element['date'];
                            var id = element.element['id'];
                            var title = element.element['title'];
                            var category = element.element['category'];
                            var slug = element.element['slug'];
                            var draft = element.element['draft'];
    
                            var serialNumber = element.serialNumber;
    
                            index++;
    
                            if(draft == true){
                                $('#tableBody').append(
                                    `
                                    <tr id="row${id}">
                                        <td>${serialNumber[index]}</td>
                                        <td>${date}</td>
                                        <td>${title}</td>
                                        <td>${category}</td>
                                        <td>
                                            <div class="dropdown">
                                                <span><i class="arrow down"></i></span>
                                                <div class="dropdown-content">
                                                    <p id="publish${id}" onClick="publishNews('publish${id}', '${id}')">Publish</p>
                                                    <p id="edit${id}" onClick="editNews('${id}', '${slug}')">Edit</p>
                                                    <p id="delete${id}" onClick="deleteNews('${id}', 'row${id}')">Delete</p>
                                                </div>
                                            </div>
                                        <td>
                                    </tr>
                                    `
                                );
                            } else{
                                $('#tableBody').append(
                                    `
                                    <tr id="row${id}">
                                        <td>${serialNumber[index]}</td>
                                        <td>${date}</td>
                                        <td>${title}</td>
                                        <td>${category}</td>
                                        <td>
                                            <div class="dropdown">
                                                <span><i class="arrow down"></i></span>
                                                <div class="dropdown-content">
                                                    <p id="unpublish${id}" onClick="unpublishNews('unpublish${id}', '${id}')">Unpublish</p>
                                                    <p id="edit${id}" onClick="editNews('${id}', '${slug}')">Edit</p>
                                                    <p id="delete${id}" onClick="deleteNews('${id}', 'row${id}')">Delete</p>
                                                </div>
                                            </div>
                                        <td>
                                    </tr>
                                    `
                                );
                            }
                        });
                    } else{
                        if(state == 401){
                            window.location.replace('login.html');
                        } else{
                            // tell the admin to wait 
                            displayProcessingInTable('Processing....', 'green');
                        }
                    }
                }
            }
        });
    } else{
        $.ajax({
            type: "GET",
            url: `${url}?page=${pageNumber}&limit=${limit}&date=${date}`,
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
                    displayProcessingInTable('Error occured, check your internet connection', 'red');
                } else{
                    var state = data.status;
    
                    if(state == 200){
                        // show the table
                        showTable();
    
                        var object = JSON.parse(data.responseText);
                        var objectArray = object['data'].rows;
    
                        responseLength = object['data'].count;
    
                        var elementToBeSorted = [];
    
                        for (let i = 1; i <= responseLength; i++) {
                            elementToBeSorted.push(i);
                        }
    
                        if(pageNumber == 1){
                            elementStart = 1;
                        } else{
                            elementStart = ((pageNumber - 1) * limit) + 1;
                        }
    
                        for (let a = elementStart; a <= elementToBeSorted.length; a++) {
                            var condition = pageNumber * limit;
                            if(a <= condition){
                                serialNumberContainer.push(a);
                            }
                        }
    
                        console.log(object['data']);
                        console.log(responseLength);
                        console.log(serialNumberContainer);
    
                        var itemsObject = [];
    
                        objectArray.forEach(element => {
                            var dateFromServer = element.createdAt;
                            var characterIndex = dateFromServer.indexOf('T');
                            var targetedIndex = characterIndex;
                            var formatedDate = dateFromServer.substring(0, targetedIndex);
                            
                            if(pageNumber == 1){
                                ++nextIndex;
                                sortIndex = nextIndex;
                                endIndex = limit;
                            } else{
                                sortIndex = 0;
                            }
    
                            var categoryName;
    
                            if(element.Category != null){
                                categoryName = element.Category.name;
                                console.log(element.Category.name);
                            } else{
                                categoryName = 'Not Assigned';
                            }
    
                            var draft = element.draft;
    
                            itemsObject.push(
                                {
                                    'element': {
                                        'date' : formatedDate,
                                        'id': element.id,
                                        'title' : element.title,
                                        'category' : categoryName,
                                        'slug' : element.slug,
                                        'draft': element.draft,
                                    },
                                    'serialNumber' : serialNumberContainer
                                } 
                            );
                        });
                        console.log(itemsObject);
    
                        itemsObject.forEach(element => {
                            var date = element.element['date'];
                            var id = element.element['id'];
                            var title = element.element['title'];
                            var category = element.element['category'];
                            var slug = element.element['slug'];
                            var draft = element.element['draft'];
    
                            var serialNumber = element.serialNumber;
    
                            index++;
    
                            if(draft == true){
                                $('#tableBody').append(
                                    `
                                    <tr id="row${id}">
                                        <td>${serialNumber[index]}</td>
                                        <td>${date}</td>
                                        <td>${title}</td>
                                        <td>${category}</td>
                                        <td>
                                            <div class="dropdown">
                                                <span><i class="arrow down"></i></span>
                                                <div class="dropdown-content">
                                                    <p id="publish${id}" onClick="publishNews('publish${id}', '${id}')">Publish</p>
                                                    <p id="edit${id}" onClick="editNews('${id}', '${slug}')">Edit</p>
                                                    <p id="delete${id}" onClick="deleteNews('${id}', 'row${id}')">Delete</p>
                                                </div>
                                            </div>
                                        <td>
                                    </tr>
                                    `
                                );
                            } else{
                                $('#tableBody').append(
                                    `
                                    <tr id="row${id}">
                                        <td>${serialNumber[index]}</td>
                                        <td>${date}</td>
                                        <td>${title}</td>
                                        <td>${category}</td>
                                        <td>
                                            <div class="dropdown">
                                                <span><i class="arrow down"></i></span>
                                                <div class="dropdown-content">
                                                    <p id="unpublish${id}" onClick="unpublishNews('unpublish${id}', '${id}')">Unpublish</p>
                                                    <p id="edit${id}" onClick="editNews('${id}', '${slug}')">Edit</p>
                                                    <p id="delete${id}" onClick="deleteNews('${id}', 'row${id}')">Delete</p>
                                                </div>
                                            </div>
                                        <td>
                                    </tr>
                                    `
                                );
                            }
                        });
                    } else{
                        if(state == 401){
                            window.location.replace('login.html');
                        } else{
                            // tell the admin to wait 
                            displayProcessingInTable('Processing....', 'green');
                        }
                    }
                }
            }
        });
    }
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

function displayMessage(message, color) {
    $('#displayId').hide();
    $('#displayId').text(`${message}`).css('color', `${color}`);
    $('#displayId').show();
    setInterval(() => {
        $('#displayId').hide();
    }, 10000);
}

function getResultBaseOnButtonId(n, l) {
    // hide the table when requesting is been made
    displayProcessingInTable('Processing...');

    // new table row length
    newTableRowLimit();

    // date picked
    newDate();

    for (let index = 1; index <= result; index++) {
        $(`#${index}`).attr('disabled', 'true');
        if(index == n){
            $(`#${index}`).css('background', 'green');
        } else{
            $(`#${index}`).css('background', 'white');
        }
    }

    $('#tableBody').remove();

    getResult(n, l).then((value) => {
        responseLength = value;

        $('#table').append(
            `
                <tbody id="tableBody">
                </tbody>
            `
        );
        
        if(date == null){
            populateDataIntoTableFromServer(n, l);
        } else{
            console.log(date);
            populateDataIntoTableFromServer(n, l, date);
        }
        console.log('working');
        for (let index = 1; index <= result; index++) {
            $(`#${index}`).removeAttr('disabled');
        }
    });
}

function getResult(n, l) {
    // new table row length
    newTableRowLimit();

    // date picked
    newDate();

    let options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${loginToken}`);
            xhr.setRequestHeader('Access-Control-Request-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
        },
    }

    //let fetchRes = fetch(`https://gve-backend-api.herokuapp.com/api/admin/news/?page=${n}&limit=${l}`, options);
    let fetchRes = fetch(`https://propertymanagementbict.herokuapp.com/api/admin/news/?page=${n}&limit=${l}`, options);


    var dataResult;

    return fetchRes.then(res =>
        res.json()).then(output => {
            dataResult = output['data'].count;
            return dataResult;
        });
}

function newTableRowLimit() {
    return $('#selectRowLimit').change(function () { 
        // console.log(this.value);
        tRowLimit = this.value;
    });
}

function newDate() {
    return $('#selectDateToSort').change(function () { 
        console.log(this.value);
        date = this.value;
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

function logicHandler() {
    $('#buttonContainer').remove();
            
    $('#tableFunctionality').append(
        `
            <div id="buttonContainer">
                <div id="onePrevious"></div>
                <div id="previous"></div>
                <div id="button"></div>
                <div id="next"></div>
                <div id="oneNext"></div>
            </div>
        `
    );

    $('#onePrevious').append(
        `
        <button onClick="onePreviousButton()"><<</button>
        `
    ).css('float', 'left').css('padding-right', '10px').css('padding-left', '10px');
    
    $('#previous').append(
        `
        <button onClick="previousButtons()">Previous</button>
        `
    ).css('float', 'left').css('padding-right', '10px');
    
    $('#next').append(
        `
        <button onClick="nextButtons()">Next</button>
        `
    ).css('float', 'left').css('padding-left', '10px');

    $('#oneNext').append(
        `
        <button onClick="oneNextButton()">>></button>
        `
    ).css('float', 'left').css('padding-left', '10px').css('padding-right', '10px');

    $('#buttonContainer').css('float', 'right');
}

function oneNextButton() {
    var end = parseInt(lastIndexOfLoop) + 1;
    console.log(end);
    console.log(result);
    
    if(end <= result ){  

        // Logic of the button
        logicHandler();

        var beginning = parseInt(beginningIndexOfLoop);

        customLoopOfButtons(beginning, end);
    } else{
        console.log('reached');
    }
}

function onePreviousButton() {
    if(beginningIndexOfLoop > 1){
        if(lastIndexOfLoop <= result){

            // Logic of the button
            logicHandler();

            var beginning = beginningIndexOfLoop - 1;
            var end = lastIndexOfLoop - 1;

            customLoopOfButtons(beginning, end);
        }
    } else{
        console.log('reached');
    }
}

$(document).ready(function () {

    $('#tableFunctionality').hide();
    $('table').hide();

    $('#selectRowLimit').change(function () { 
        // console.log(this.value);
        tRowLimit = this.value;
    });

    getResult(1, tRowLimit).then((value) =>{
        // the logic parameter
        $('#tableFunctionality').show();
        $('#tableFunctionality').css('margin-bottom', '10px').css('padding-left', '10px').css('padding-right', '10px');

        $('#buttonContainer').css('float', 'right');

        // show the table
        $('table').show();

        // new table row length

        newTableRowLimit();
        console.log(tRowLimit);
        var noOfButton = getNumberOfButtons(value, tRowLimit);

        if(noOfButton == 10 && pageNumber == 1){
            customLoopOfButtons(1, 10);
        } else{
            customLoopOfButtons(1, tRowLimit);
        }
        $('#1').css('background', 'green');
    }).finally(() => {
        if(date == null){
            populateDataIntoTableFromServer(1, tRowLimit);
        } else{
            populateDataIntoTableFromServer(1, tRowLimit, date);
        }
    });

    $('#onePrevious').append(
        `
        <button onClick="onePreviousButton()"><<</button>
        `
    ).css('float', 'left').css('padding-right', '10px').css('padding-left', '10px');
    
    $('#previous').append(
        `
        <button onClick="previousButtons()">Previous</button>
        `
    ).css('float', 'left').css('padding-right', '10px');
    
    $('#next').append(
        `
        <button onClick="nextButtons()">Next</button>
        `
    ).css('float', 'left').css('padding-left', '10px');

    $('#oneNext').append(
        `
        <button onClick="oneNextButton()">>></button>
        `
    ).css('float', 'left').css('padding-left', '10px').css('padding-right', '10px');

    $('#selectDateToSort').change(function () { 
        // console.log(this.value);
        date = this.value;
    });
});