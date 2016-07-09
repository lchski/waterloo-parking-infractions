const choo = require('choo')

const mainView = require('./views/main')

const app = choo()
app.model(require('./model'))

app.router((route) => [
    route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)