'use strict';

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($('#domoName').val() == '' || $('#domoAge').val() == '' || $('#domoLives').val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $('#domoForm').attr("action"), $("#domoForm").serialize(), function () {
        console.log($('#domoCsrf').val());
        loadDomosFromServer($('#domoCsrf').val());
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        'form',
        { id: 'domoForm',
            onSubmit: handleDomo,
            action: '/maker',
            method: 'POST',
            className: 'domoForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
        React.createElement(
            'label',
            { htmlFor: 'age' },
            'Age: '
        ),
        React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
        React.createElement(
            'label',
            { htmlFor: 'lives' },
            'Lives: '
        ),
        React.createElement('input', { id: 'domoLives', type: 'text', name: 'lives', placeholder: 'Domo Lives' }),
        React.createElement('input', { id: 'domoCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
    );
};

var DomoList = function DomoList(props) {
    console.log(props);
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domoList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos yet'
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                'Name: ',
                domo.name
            ),
            React.createElement(
                'h3',
                { className: 'domoAge' },
                'Age: ',
                domo.age
            ),
            React.createElement(
                'h3',
                { className: 'domoLives' },
                'Lives: ',
                domo.lives
            )
        );
    });
    console.log("hi");
    console.log(props);
    return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes,
        React.createElement(
            'form',
            { id: 'deleteForm',
                onSubmit: handleDelete,
                action: '/cleared',
                method: 'DELETE'
            },
            React.createElement('input', { id: 'deleteCsrf', type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Clear All' })
        )
    );
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);
    console.log($('#deleteCsrf').val());
    sendAjax('DELETE', $('#deleteForm').attr("action"), $("#deleteForm").serialize(), function () {

        loadDomosFromServer($('#deleteCsrf').val());
    });

    return false;
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector('#makeDomo'));

    ReactDOM.render(React.createElement(DomoList, { csrf: csrf, domos: [] }), document.querySelector('#domos'));

    loadDomosFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({
        width: 'toggle'
    }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({
        width: 'hide'
    }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
