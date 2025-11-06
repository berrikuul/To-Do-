const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const categorySelect = document.getElementById('task-category');


const lists = {
planned: document.getElementById('planned-list'),
inprogress: document.getElementById('inprogress-list'),
done: document.getElementById('done-list')
};

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');


function save(){
localStorage.setItem('tasks', JSON.stringify(tasks));
}


function render(){
Object.values(lists).forEach(ul=>ul.innerHTML='');
tasks.forEach(task=>{
const li = document.createElement('li');
li.textContent = `${task.title} (${task.category})`;


const controls = document.createElement('div');

if(task.status != 'planned'){
const prev = document.createElement('button');
prev.textContent = '<';
prev.onclick = ()=>{ move(task.id, -1); };
controls.appendChild(prev);
}

if(task.status != 'done'){
const next = document.createElement('button');
next.textContent = '>';
next.onclick = ()=>{ move(task.id, +1); };
controls.appendChild(next);
}

const del = document.createElement('button');
del.textContent = '✕';
del.onclick = ()=>{ remove(task.id); };
controls.appendChild(del);


li.appendChild(controls);
lists[task.status].appendChild(li);
});
}


function addTask(title, category){
const id = Date.now().toString();
tasks.push({id, title, category, status: 'planned'});
save(); render();
}


function remove(id){
tasks = tasks.filter(t=>t.id != id);
save(); render();
}


function move(id, dir){
const order = ['planned','inprogress','done'];
const t = tasks.find(x=>x.id==id);
const idx = order.indexOf(t.status);
t.status = order[idx + dir];
save(); render();
}


form.addEventListener('submit', e=>{
e.preventDefault();
addTask(titleInput.value.trim(), categorySelect.value);
titleInput.value='';
});


render();