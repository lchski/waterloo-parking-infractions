const html = require('choo/html')

module.exports = (state, prev, send) => {
    return html`
    <div onload=${() => send('getStreets')}>
      <h1>Streets</h1>
      <ul>
        ${state.streets.sort().map((street) => html`<li>${street}</li>`)}
      </ul>
    </div>`
}