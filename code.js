function App() {
  const [tasks, setTasks] = React.useState(
    JSON.parse(localStorage.getItem('tasks') || '[]')
  );
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Личное');

  const save = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      status: 'planned'
    };

    const newTasks = [...tasks, newTask];
    save(newTasks);
    setTitle('');
  };

  const removeTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    save(newTasks);
  };

  const moveTask = (id, dir) => {
    const order = ['planned', 'inprogress', 'done'];
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const idx = order.indexOf(t.status);
        return { ...t, status: order[idx + dir] };
      }
      return t;
    });
    save(newTasks);
  };

  const renderColumn = (status, titleText) => (
    <section className="column">
      <h2>{titleText}</h2>
      <ul>
        {tasks
          .filter(t => t.status === status)
          .map(t => (
            <li key={t.id}>
              <span>{t.title} ({t.category})</span>
              <div>
                {status !== 'planned' && (
                  <button onClick={() => moveTask(t.id, -1)}>&lt;</button>
                )}
                {status !== 'done' && (
                  <button onClick={() => moveTask(t.id, +1)}>&gt;</button>
                )}
                <button onClick={() => removeTask(t.id)}>✕</button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );

  return (
    <div className="app-container">
      <header>Мои задачи</header>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Введите задачу..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Личное">Личное</option>
          <option value="Работа">Работа</option>
          <option value="Учёба">Учёба</option>
        </select>
        <button type="submit">Добавить</button>
      </form>

      <div className="columns">
        {renderColumn('planned', 'Запланированные')}
        {renderColumn('inprogress', 'В работе')}
        {renderColumn('done', 'Готовые')}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
