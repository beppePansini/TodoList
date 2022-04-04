let taskAdd = document.getElementById("button-add");
let taskContent = document.getElementById("task-content");
let tasksList = document.getElementById("tasks-list");
let buttonRemove = document.getElementById("button-remove");
let taskCategory = document.getElementById("categories-list");
let counterDone = document.getElementById("counter-done-task");
let counter = 0;
let taskCounter = document.getElementById("task-counter");
let taskDone = document.getElementById("task-done");
let counterTaskDone = 0;
const HTTP_RESPONSE_SUCCESS = 200;
const REST_API_ENDPOINT = 'http://localhost:8080';

/**
 * questa funzione aggiorna la select delle categorie interrogando il server attraverso ajax
 * verrà invocata subito dopo il completo caricamento della pagina
 */
function updateCategoriesList() {
    //crea un oggetto di tipo XMLHttpRequest x gestire chiamata ajax al server
    let ajaxRequest = new XMLHttpRequest();
    //gestisco l'onload: ovvero quello che succede dopo che il server mi risponde
    ajaxRequest.onload = function () {
        //salvo tutte le categorie ritornate dal server in una variabile categories parsando il contenuto
        //della response attraverso l'utility JSON.parse()
        let categoriesDB = JSON.parse(ajaxRequest.response);
        //cicliamo ogni categoria all'interno dell'array categories
        for (let category of categoriesDB) {
            //creo elemento di tipo option
            let newOption = document.createElement("option");
            //setto alla option il valore e il testo prendendolo dal nome della categoria
            newOption.value = category.id;
            newOption.innerText = category.name;
            //appendo l'option alla select
            taskCategory.appendChild(newOption);
        }
    }
    //imposto metodo e url a cui fare la richiesta
    ajaxRequest.open("GET", REST_API_ENDPOINT + "/categories/");
    //invio la richiesta al server
    ajaxRequest.send();
}

updateCategoriesList();

function createTask(task) {
    // creo un elemento di tipo div
    let newTaskLine = document.createElement("div");
    //newTaskLine.setAttribute("data-id", task.id);
    // assegno class="task" a newTaskLine
    newTaskLine.setAttribute("class", "task");
    taskCounter.innerHTML += 1;
    taskDone.innerHTML = counterTaskDone;
    // se task.category è true
    if (task.category) {
        // aggiungo classi task category color
        newTaskLine.classList.add(task.category.color);
    }
    /* let categorySpan = document.createElement("span");
    categorySpan.setAttribute("class", "category " + task.category.color);
    let selectedCategory = taskCategory.options[taskCategory.selectedIndex];
    categorySpan.classList.add(selectedCategory.dataset.category);
    newTaskLine.appendChild(categorySpan); */

    // creo un elemento di tipo input
    let doneCheck = document.createElement("input");
    // assegno l'attributo type="checkbox" alla variabile doneCheck
    doneCheck.setAttribute("type", "checkbox");
    //assegno la classe checkbox all'elemento
    doneCheck.classList.add("checkbox");
    //aggiungo l'evento al click della checkbox 
    doneCheck.addEventListener("click", function () {
        //aggiorno lo stato del campo done dell'ogg in memoria
        task.done = !task.done;
        let taskContent = {
            done: task.done
        };
        setDone(task.id, taskContent, () => {
            // aggiungo la linea sugli elementi spuntati
            newTaskLine.classList.toggle("task-done");
            penIcon.style.visibility = task.done ? "hidden" : "visible";
            taskDone.innerHTML = task.done ? ++counterTaskDone : --counterTaskDone;
        });
    });
    // se il task è spuntato
    if (task.done) {
        taskDone.innerHTML = ++counterTaskDone;
    }
    // svuoto il contenuto del taskContent dopo l'aggiunta del task
    taskContent.value = "";
    // se la task è fatta
    if (task.done) {
        taskDone.innerHTML = ++counterTaskDone;
        // aggiunge la classe "task-done" all'elemento
        newTaskLine.classList.add("task-done");
        //se la variabile doneCheck è checked(spuntata) allora è true
        doneCheck.checked = true;
    }
    //appendiamo la checkbox alla nuova task creata
    newTaskLine.appendChild(doneCheck);
    //creiamo un elemento di tipo span chiamato nameSpan
    let nameSpan = document.createElement("span");
    //
    nameSpan.innerText = task.name;

    //appendiamo nameSpan alla nuova task creata
    newTaskLine.appendChild(nameSpan);

    //creiamo un elemento di tipo span chiamato dateSpan
    let dateSpan = document.createElement("span");

    // assegnamo la classe "date" a dateSpan
    dateSpan.setAttribute("class", "date");
    let today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let date = today.getDate();
    let currentDate = `${month}/${date}/${year}`;

    dateSpan.innerText = currentDate;
    newTaskLine.appendChild(dateSpan);


    let penIcon = document.createElement("button");
    penIcon.style.visibility = task.done ? "hidden" : "visible";
    penIcon.setAttribute("class", "pen");
    penIcon.innerHTML = '<i class="fas fa-edit"></i>';
    newTaskLine.appendChild(penIcon);


    penIcon.addEventListener("click", function () {
        let newInput = document.createElement("input");
        newInput.setAttribute("id", "edit-input-" + task.id);
        if (newTaskLine.classList.contains("editing")) {
            let editInput = document.getElementById("edit-input-" + task.id);
            console.log(editInput);
            let taskContent = {
                name: editInput.value
            };
            updateTask(task.id, taskContent, () => {
                //aggiorno l'attributo name dell'oggetto task su cui sto lavorando
                task.name = editInput.value;

                //sostituisco l'input con uno span contenente il testo aggiornato
                nameSpan.innerText = task.name;
                editInput.replaceWith(nameSpan);

                //sostituisco il dischetto con la pennina 
                penIcon.innerHTML = '<i class="fas fa-edit"></i>';

                //rimuovo la classe editing 
                newTaskLine.classList.remove("editing");

                doneCheck.style.visibility = "visible";
            });

        } else {
            newInput.value = task.name;
            nameSpan.replaceWith(newInput);
            penIcon.innerHTML = '<i class="fas fa-save"></i>';
            newTaskLine.classList.add("editing");
            doneCheck.style.visibility = "hidden";
        }
    });

    // creiamo un elemento di tipo span chiamato trashSpan
    let trashSpan = document.createElement("span");

    //assegnamo a trash span l'icona del cestino
    trashSpan.innerHTML = '<i class="fas fa-trash"></i>';
    trashSpan.setAttribute("class", "trash");

    // aggiungiamo l'evento sul click del cestino
    trashSpan.addEventListener("click", function () {

        //richiamiamo la funzione deleteTask
        deleteTask(task.id, newTaskLine); 
            
        //alternativeDeleteTask(task.id, newTaskLine);
    });
    // appendiamo la nuova task creata alla lista di tutte le task
    tasksList.appendChild(newTaskLine);
    // appendiamo il cestino alla nuova task creata
    newTaskLine.appendChild(trashSpan);
    if (task.done) {
        counterTaskDone++;
    }
    counter++;
    taskCounter.innerHTML = counter;
    taskDone.innerHTML = counterTaskDone;
}

function updateTasksList() {

    // svuoto la tasksList
    tasksList.innerHTML = "";

    //recupero i dati dal server //crea un oggetto di tipo XMLHttpRequest x gestire chiamata ajax al server
    let ajaxRequest = new XMLHttpRequest();

    //gestisco l'onload: ovvero quello che succede dopo che il server mi risponde
    ajaxRequest.onload = function () {

        //salvo tutti i task ritornate dal server in una variabile tasks parsando il contenuto
        //della response attraverso l'utility JSON.parse()
        let tasks = JSON.parse(ajaxRequest.response);

        //cicliamo ogni task all'interno dell'array tasks
        for (let task of tasks) {

            //invoco funzione createTask
            createTask(task);
        }
    }

    //imposto metodo e url a cui fare la richiesta
    ajaxRequest.open("GET", REST_API_ENDPOINT + "/tasks/");

    //invio la richiesta al server
    ajaxRequest.send();
}

function saveTask(taskToSave) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        let savedTask = JSON.parse(ajaxRequest.response);
        createTask(savedTask);
    }

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/add");
    //dal momento che il server è di tipo REST-full utilizza il tipo JSON per scambiare informazioni con il backend
    //pertanto il server spring si aspetterà dei dati in formato JSON e NON considererà richieste in cui il formato non è specificato nella Header della richiesta stessa -> header sono informazioni che sono all'inizio di una request
    ajaxRequest.setRequestHeader("content-type", "application/json");
    let body = {
        name: taskToSave.name,
        category: {
            id: taskToSave.categoryId
        }
    };
    ajaxRequest.send(JSON.stringify(body));
}

function updateTask(taskId, taskContent, successfulCallback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {
            successfulCallback();
        }
    }

    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.setRequestHeader("content-type", "application/json");
    ajaxRequest.send(JSON.stringify(taskContent));
}

function setDone(taskId, taskContent, successfulCallback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        if (ajaxRequest.status == HTTP_RESPONSE_SUCCESS) {
            successfulCallback();
        }
    }

    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId + "/set-done");
    ajaxRequest.setRequestHeader("content-type", "application/json");
    ajaxRequest.send(JSON.stringify(taskContent));
}

/* function alternativeUpdateTask(taskId, taskContent, taskHtmlElement) { 
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        taskHtmlElement.classList.toggle("done");
    } 

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/edit" + taskId);
    ajaxRequest.setRequestHeader("content-type", "application/json");
    ajaxRequest.send(JSON.stringify(taskContent));
} */

updateTasksList();

function deleteTask(taskId, taskElement) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        if (ajaxRequest.response == "ok") {
            if(taskElement.classList.contains("task-done")) {
                //counterDone--;
                taskDone.innerHTML = --taskDone;
            }
            taskElement.remove();
            counter--;
            taskCounter.innerHTML = counter;
        }
    }

    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.send();
}

function deleteAllTasks(successfulCallBack) {
    let ajaxRequest = new XMLHttpRequest;
    ajaxRequest.onload = () => {
        if (ajaxRequest.response == "ok") {
            successfulCallBack();
        }
    }
    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks");
    ajaxRequest.send();
}

/* function alternativeDeleteTask(taskId, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
       if (ajaxRequest.response == "ok") {
           taskHtmlElement.remove();
       }
    } 

    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/delete" + taskId);
    ajaxRequest.send();
} */

taskAdd.addEventListener("click", function () {
    //creo una variabile che contiene il valore inserito nell'input del task(es. comprare latte)
    let taskContentValue = taskContent.value;
    //se il valore inserito è vuoto
    if (taskContentValue == "") {
        //lancio messaggio all'utente che deve inserire qualcosa
        alert("write something!");
        //ed esco dalla funzione con return
        return;
    }
    let categorySelect = taskCategory.value;
    if (!categorySelect) {
        alert("aggiungi una categoria");
        return;
    }
    //creo un ogg che rappresenta il task da aggiungere
    let task = {
        name: taskContentValue,
        categoryId: categorySelect
    };

    //sendTaskToServer(taskContentValue); */
    /* const taskContentValue = taskContent.value;
    const categoryId = taskCategory.value;
    if (taskContentValue.length < 1) {
        alert("write something!");
        return;
    }

    console.log(taskCategory.options[taskCategory.selectedIndex].dataset.color);
    console.log(taskCategory.selectedIndex);
    //mi creo un oggetto che rappresenta il task da aggiungere...
    let task = {
        name: taskContentValue,
        category: {
           id: categoryId,
           color: taskCategory.options[taskCategory.selectedIndex].dataset.color
        }
    }; */

    //se esiste un valore lo passo alla funzione saveTask che si occuperà di salvarlo nel db
    saveTask(task, () => {
        taskContent.value = "";
    });
});


// aggiungo un evento al click del bottone che rimuove tutti gli elementi e lascia la lista vuota
buttonRemove.addEventListener("click", function () {
    deleteAllTasks(() => {
        tasksList.innerHTML = "";
        counterDone.innerHTML = 0;
    });
});

function sendTaskToServer(taskContentValue, taskHtmlElement, done, remove, edit) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        console.log(ajaxRequest.response);
        if (ajaxRequest.response == "ok") {
            taskHtmlElement.classList.remove("unconfirmed");
            done.removeAttribute("disabled", "disabled");
            remove.removeAttribute("disabled", "disabled");
            edit.removeAttribute("disabled", "disabled");
        }
    };

    ajaxRequest.open("POST", "https://webhook.site/b2216fb0-2af7-4693-930e-f539626cf0cc");
    let body = {
        text: taskContentValue
    };
    ajaxRequest.send(JSON.stringify(body));
}