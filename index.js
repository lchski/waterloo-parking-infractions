const choo = require('choo')
const http = require('choo/http')

const mainView = require('./views/main')

const streetApi = {
    getAll: (cb) => {
        http('./streets.json', (error, response, body) => {
            cb(JSON.parse(body))
        })
    }
}

const app = choo()

app.model({
    state: {
        streets: [],
        filteredStreets: []
    },
    reducers: {
        receiveStreets: (data, state) => {
            return { streets: data, filteredStreets: data.sort() }
        },
        filterStreets: (data, state) => {
            return { filteredStreets: [data.query]}
        },
        resetStreets: (data, state) => {
            return { filteredStreets: state.streets }
        }
    },
    effects: {
        getStreets: (data, state, send, done) => {
            streetApi.getAll((streets) => {
                send('receiveStreets', streets, done)
            })
        }
    }
})

app.router((route) => [
    route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)