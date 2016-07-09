const html = require('choo/html')

module.exports = (state, prev, send) => {
    return html`
    <div>
      <h1>Todos</h1>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
      </ul>
    </div>`
}