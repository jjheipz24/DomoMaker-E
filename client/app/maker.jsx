const handleDomo = (e) => {
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
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm">

            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="lives">Lives: </label>
            <input id="domoLives" type="text" name="lives" placeholder="Domo Lives" />
            <input id="domoCsrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />

        </form>
    );
};

const DomoList = function (props) {
    console.log(props);
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLives">Lives: {domo.lives}</h3>
            </div>
        );
    });
    console.log("hi");
    console.log(props);
    return (
        <div className="domoList">
            {domoNodes}

            <form id="deleteForm"
                onSubmit={handleDelete}
                action="/cleared"
                method="DELETE"
            >
                <input id="deleteCsrf" type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Clear All" />

            </form>
        </div>
    );
};

const handleDelete = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);
    console.log($('#deleteCsrf').val());
    sendAjax('DELETE', $('#deleteForm').attr("action"), $("#deleteForm").serialize(), function () {

        loadDomosFromServer($('#deleteCsrf').val());
    });

    return false;
}

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList csrf={csrf} domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <DomoList csrf={csrf} domos={[]} />, document.querySelector('#domos')
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});