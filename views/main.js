const html = require('choo/html')

module.exports = (state, prev, send) => {
    return html`
    <div onload=${() => send('getStreets')}>
        <h1>Streets</h1>
        <input type="text" placeholder="Search" oninput=${(e) => {
            send('filterStreets', {query: e.target.value})
        }}>
        <form onsubmit=${onClear}>
            <input type="submit" value="Clear">
        </form>
        <ul>
            ${state.filteredStreets.map((street) => html`<li>${street}</li>`)}
        </ul>
    </div>`

    function onClear(e) {
        send('resetStreets')

        e.preventDefault();
    }
}