const html = require('choo/html')

module.exports = (state, prev, send) => {
    return html`
    <div onload=${() => send('getStreets')}>
      <h1>Streets</h1>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="Search" id="searchQuery">
      </form>
      <form onsubmit=${onClear}>
        <input type="submit" value="Clear">
      </form>
      <ul>
        ${state.filteredStreets.map((street) => html`<li>${street}</li>`)}
      </ul>
    </div>`

    function onSubmit(e) {
        const input = e.target.children[0]

        send('filterStreets', {query: input.value})

        e.preventDefault()
    }

    function onClear(e) {
        send('resetStreets')

        e.preventDefault();
    }
}