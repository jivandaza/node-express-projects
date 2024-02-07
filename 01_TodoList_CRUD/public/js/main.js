const $frmMessage = document.getElementById('frmMessage');
const $taskListContainer = document.getElementById('taskListContainer');
let urlPath = location.pathname;

if ( urlPath === '/' ) {
    document.addEventListener('DOMContentLoaded', () => {
        loadAllTasks();
    });

    document.getElementById('btnSave').addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
} else {
    const path = location.pathname;
    document.addEventListener('DOMContentLoaded', async () => {
        showEditData(path);
    });
    document.getElementById('btnUpdate').addEventListener('click', (e) => {
        e.preventDefault();
        editTask(path);
    });
    document.getElementById('btnHome').addEventListener('click', () => {
        redirectHomePage();
    })
}

function loadAllTasks() {
    fetch('/listTasks', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        const { err, errorMsg, taskList, isEmpty, emptyListMsg } = data;
        if ( err ) {
            messageInListTask(errorMsg, 'danger');
        } else {
            if ( isEmpty ) {
                messageInListTask(emptyListMsg, 'info');
            } else {
                let html = '';
                taskList.forEach((task) => {
                    //$taskListContainer.appendChild(createTaskUI(task));
                    html += createTaskUI(task);
                });
                $taskListContainer.innerHTML = html;
                loadButtonsTask();
            }
        }
    })
    .catch(err => console.error(err.message));
}

function addTask () {
    const $frmAdd = document.getElementById('frmAddTask');

    let title = $frmAdd.elements['title'].value.trim();
    let description = $frmAdd.elements['description'].value.trim();
    let errorMessage = frmValidate({title, description});

    if ( errorMessage ) {
        messageInForm(errorMessage, 'danger');
    } else {
        fetch('/addTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then( data => {
            const { err, errorMsg, successMsg, taskRes } = data;
            if ( err ) {
                messageInForm(errorMsg, 'danger');
            } else {
                messageInForm(successMsg, 'success');
                $frmAdd.reset();
                setTimeout(() => {
                    const $newTask = createTaskUI(taskRes);
                    $taskListContainer.insertAdjacentHTML('afterbegin', $newTask);
                    loadButtonsTask();
                }, 2000);
            }
        })
        .catch( err => console.error(err.message));
    }
}

function editTask(url) {
    const $frmEdit = document.getElementById("frmEditTask");

    let title = $frmEdit.elements["title"].value.trim();
    let description = $frmEdit.elements["description"].value.trim();
    let errorMessage = frmValidate({title, description});

    if ( errorMessage ) {
        messageInForm(errorMessage, 'danger');
    } else {
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(data => {
            const { err, errorMsg, successMsg } = data;
            if ( err ) {
                messageInForm(errorMsg, 'danger');
            } else {
                messageInForm(successMsg, 'success');
                setTimeout(() => {
                    redirectHomePage();
                }, 2000);
            }
        })
        .catch( err => console.error(err.message));
    }
}

function setStateChange (path) {
    fetch(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        showStateChange(data);
    })
    .catch( err => console.error(err.message));
}

function showStateChange (data) {
    const { err, errorMsg, successMsg, task } = data;
    const icon = err ? 'error' : 'success';
    const text = err ? errorMsg : successMsg;
    if ( err ) {
        Swal.fire({
            text,
            icon
        });
    } else {
        Swal.fire({
            text,
            icon
        });
        setTimeout(() => {
            changeTaskState(task);
        }, 2000);
    }
}

function showEditData(path) {
    const id = getIdTask(path);
    const $frmEdit = document.getElementById('frmEditTask');
    fetch(`/getTask/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        const { err, task } = data;
        if ( !err ) {
            $frmEdit.elements['title'].value = task.title;
            $frmEdit.elements['description'].value = task.description;
        }
    })
    .catch(err => console.error(err.message));
}

function showEditPage(path) {
    fetch(path, {
        'method': 'GET'
    })
    .then(response => response)
    .catch(err => console.error(err.message));
}

function removeTask(path) {
    fetch(path, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            const { err, errorMsg, successMsg, id } = data;
            const text = err ? errorMsg : successMsg;
            const icon = err ? 'error' : 'success';
            if ( err ) {
                Swal.fire({
                    text,
                    icon
                });
            } else {
                Swal.fire({
                    text,
                    icon
                });
                setTimeout(() => {
                    document.getElementById(`task${id}`).remove();
                }, 2000);
            }
        })
        .catch( err => console.error(err.message));
}

function validateTask(path) {
    const id = getIdTask(path);
    fetch(`/getTask/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        const { err, errorMsg } = data;

        if ( err ) {
            Swal.fire({
                text: errorMsg,
                icon: 'error'
            });
        } else {
            location.href = path;
            showEditPage(path);
        }
    })
    .catch( err => console.error(err.message));
}

function loadButtonsTask() {
    const editBtnList = document.querySelectorAll('.btn-edit');
    const stateBtnList = document.querySelectorAll('.btn-state');
    const removeBtnList = document.querySelectorAll('.btn-remove');

    editBtnList.forEach((btn) => {
        btn.addEventListener('click',  (e) => {
            e.preventDefault();
            const path = btn.getAttribute('href');
            validateTask(path);
        });
    });

    stateBtnList.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const path = btn.getAttribute('href');
            setStateChange(path);
        });
    });

    removeBtnList.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const path = btn.getAttribute('href');
            removeTask(path);
        });
    });
}

function messageInListTask (message, type) {
    $taskListContainer.innerHTML = `
        <div class='alert alert-${type} text-center' role='alert'>
            ${message}
        </div>
    `;
}

function messageInForm (message, type) {
    $frmMessage.style.display = 'block';
    $frmMessage.setAttribute('class', `alert alert-${type} mt-3` );
    $frmMessage.setAttribute('role', 'alert');
    $frmMessage.textContent = `${message}`;
    setTimeout(() => {
        $frmMessage.style.display = 'none';
    }, 2000 );
}

const frmValidate = (task) => {
    if ( !task.title ) {
        return 'The title is required';
    }
    if ( task.title.length < 5 ) {
        return 'The title must contain 5 or more characters';
    }
    if ( !task.description ) {
        return 'The description is required';
    }
    if ( task.description.length < 8 ) {
        return 'The description must contain 8 or more characters';
    }
    return null;
}

/*
const createTaskUI = (task) => {
    const {id, title, description, state} = task;
    const $div = document.createElement('div');
    $div.setAttribute('class', `alert alert-${getColorTask(state)} row mb-3`);
    $div.setAttribute('role', 'alert');
    $div.setAttribute('id', `task${id}`);

$div.innerHTML = `
    <div class="col-md-2 center-element">
        <span class="material-symbols-outlined ">
            task
        </span>
    </div>
    <div class="col-md-8">
            <p class="m-0"><b>Title: </b>${title}</p>
            <p class="m-0"><b>Description: </b>${description}</p>
            <p class="m-0"><b>State: </b>${getNameState(state)}</p>
    </div>
    <div class="col-md-2 center-element">
            <a href='/${getPathState(state)}Task/${id}' class="btn-state center-element">
                <span class="material-symbols-outlined">
                    ${getIconState(state)}
                </span>
            </a>
            <a href="/editTask/${id}" class="btn-edit center-element">
                <span class="material-symbols-outlined">
                    cached
                </span>
            </a>
            <a href="/remove/${id}" class="btn-remove center-element">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </a>
    </div>
`;

return $div;
}
 */

const createTaskUI = (task) => {
const {id, title, description, state} = task;
return `
    <div class="alert alert-${getColorTask(state)} row mb-3" role="alert" id="task${id}">
        <div class="col-md-2 center-element">
            <span class="material-symbols-outlined ">
                task
            </span>
        </div>
        <div class="col-md-8">
            <p class="m-0"><b>Title: </b>${title}</p>
            <p class="m-0"><b>Description: </b>${description}</p>
            <p class="m-0"><b>State: </b>${getNameState(state)}</p>
        </div>
        <div class="col-md-2 center-element">
            <a href='/${getPathState(state)}Task/${id}' class="btn-state center-element">
                <span class="material-symbols-outlined">
                    ${getIconState(state)}
                </span>
            </a>
            <a href="/editTask/${id}" class="btn-edit center-element">
                <span class="material-symbols-outlined">
                    cached
                </span>
            </a>
            <a href="/removeTask/${id}" class="btn-remove center-element">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </a>
        </div>
    </div>
`;
};

function changeTaskState(task) {
    const {id, state} = task;
    const color = getColorTask(state);
    const path = getPathState(state);
    const icon = getIconState(state);
    document.getElementById(`task${id}`)
        .setAttribute('class', `alert alert-${color} row mb-3`);
    const $btnState = document.querySelectorAll(`#task${id} a`)[0];
    const $textState = document.querySelectorAll(`#task${id} p`)[2];
    $btnState.setAttribute('href', `${path}Task/${id}`);
    $btnState.querySelector('span').textContent = icon;
    $textState.innerHTML = `<b>State: </b>${getNameState(state)}`;
}

const getColorTask = (state) => (state ? 'info' : 'warning');

const getNameState = (state) => (state ? 'Completed' : 'Uncompleted');

const getPathState = (state) => (state ? 'uncompleted' : 'completed');

const getIconState = (state) => (state ? 'close' : 'done');

const getIdTask = (path) => {
    const match = path.match(/\/(\d+)$/);
    return match ? match[1] : null;
}

const redirectHomePage = () => (location.pathname = '/');

