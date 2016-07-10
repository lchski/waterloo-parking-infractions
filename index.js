const choo = require('choo')
const http = require('choo/http')

const mainView = require('./views/main')
const d3View = require('./views/d3/histogram')

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
            let filteredStreets = state.streets.filter((element, index, array) => {
                return element.toLowerCase().indexOf(data.query.toLowerCase()) >= 0;
            })

            return { filteredStreets: filteredStreets }
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
    route('/', mainView),
    route('/d3hist', require('./views/d3/histogram')),
    route('/d3time', require('./views/d3/time'))
])

const tree = app.start({
    hash: true
})
document.body.appendChild(tree)