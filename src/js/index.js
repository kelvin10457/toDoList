import { Task } from './models/task.js';

const buttonAddTask = document.getElementById('buttonAddTask');
const tasksContainer = document.getElementById('tasksContainer');
//modal
const modal = document.getElementById('modal');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

//inputs from modal
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const listOfStatus = document.getElementById('taskStatus');


//list of tasks
let listOfTasks = [];
let id = 0;

let currentTask = null;

tasksContainer.addEventListener('click',(event) => {
    const taskClicked = event.target.closest('.task');
    if(!taskClicked) return;
    const task = listOfTasks.find((task) => task.id == taskClicked.id);
    currentTask = task;
    displayModal('edit',currentTask);
});

buttonAddTask.addEventListener('click',(event) => {
    displayModal('create',null);
});

//the attributes on the top are optional, 
// once you pass another params they change
function displayModal(mode,task){
    modal.dataset.mode = mode;
    currentTask = task;
    saveButton.textContent = mode == 'create' ? 'Save' : 'Update';
    cancelButton.textContent = mode == 'create' ? 'Cancel' : 'Delete';
    
    if(mode == 'edit' && task){
        titleInput.value = currentTask.title;
        descriptionInput.value = currentTask.description;
        listOfStatus.value = currentTask.status;
    }
    else{
        cleanModal();
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.addEventListener('click',(event) => {
    if(modal.dataset.mode === 'edit'){
        if(event.target === saveButton){
            const validTask = updateTask(currentTask);
            console.log(validTask);
            
            if(!validTask) return;
            cleanModal();
            hideModal();
        }
        if(event.target === cancelButton){
            deleteTask(currentTask);
            cleanModal();
            hideModal();
        }
        if(event.target === modal || event.target === cancelButton || event.target === saveButton){
            cleanModal();
            hideModal();
        }
    }
    else{
        //if it is in 'create' mode 
        if(event.target === saveButton){
            const title = titleInput.value;
            const description = descriptionInput.value;
            const status = listOfStatus.value;
            const validTask = createTask({ title, description, status });
            if(!validTask) return;
            cleanModal();
            hideModal();
        }
        if(event.target === modal || event.target === cancelButton || event.target === saveButton){
            cleanModal();
            hideModal();
        }
    }
    
    
});

function createTask({ title, description, status }){
    if(title === undefined || title === '') return false;
    if(description === undefined || description === '') return false;
    if(status === 'none') return false;

    const task = new Task(id++,title,description,status);
    listOfTasks.push(task);

    let statusColor = getColorByStatus(task.status);

    const taskHTML = `
    <div id="${task.id}" class="task bg-slate-50 text-slate-950 flex-col justify-between items-center rounded-sm p-4 my-4 w-11/12 mx-auto lg:w-full cursor-pointer outline-1 outline-slate-950">
        <h1 class="text-2xl text-slate-600 font-bold">
            ${task.title} - <span class="${statusColor}">${task.status}</span>
        </h1>
        <p>${task.description}</p>
    </div>
    `;

    tasksContainer.insertAdjacentHTML('afterbegin',taskHTML);
    return true;
}

function updateTask(task){
    const indexOfCurrentTask = listOfTasks.findIndex((t) => t.id === task.id);
    
    
    if(titleInput.value === undefined || titleInput.value === '') return false;
    if(descriptionInput.value === undefined || descriptionInput.value === '') return false;
    if(listOfStatus.value === 'none') return false;
    
    //updating the array of tasks
    listOfTasks[indexOfCurrentTask].title = titleInput.value;
    listOfTasks[indexOfCurrentTask].description = descriptionInput.value;
    listOfTasks[indexOfCurrentTask].status = listOfStatus.value;


    const taskSelected = document.getElementById(task.id);
    const taskSelectedTitle = taskSelected.querySelector('h1');
    const taskSelectedDescription = taskSelected.querySelector('p');
    taskSelectedDescription.textContent = descriptionInput.value;
    taskSelectedTitle.innerHTML = `${titleInput.value} - <span class="${getColorByStatus(task.status)}">${task.status}</span>`;
    
    return true;
}

function deleteTask(task){
    listOfTasks = listOfTasks.filter((t) => t.id !== task.id);
    const taskSelected = document.getElementById(task.id).remove();
    console.log(listOfTasks);
    
}

function getColorByStatus(status){
    switch(status){
        case 'pending' : return 'text-yellow-600';
        case 'inProgress' : return 'text-blue-600';
        case 'completed' : return 'text-green-600';
    }
}

function hideModal(){
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    currentTask = null;
}

function cleanModal(){
    titleInput.value = '';
    descriptionInput.value = '';
    listOfStatus.value = 'none';
}
