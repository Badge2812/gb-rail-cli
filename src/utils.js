import fs from 'fs'
const StationDetails = JSON.parse(fs.readFileSync('src/data/stations.json', 'utf8'));

const crsFunctions = {
    searchStation: function(search) {
        for (const [crs, data] of Object.entries(StationDetails.Stations)) {
            if (search == crs) {
                return data.stationName
            }
        }
        return 'Station not found'
    },
    
    searchCRS: function(search) {
        for (const [crs, data] of Object.entries(StationDetails.Stations)) {
            if (search.toLowerCase() == data.stationName.toLowerCase()) {
                return crs
            }
        }
        return 'Station not found'
    },

    authenticateCRS: function(search) {
        for (const [crs, data] of Object.entries(StationDetails.Stations)) {
            if (search == crs) {
                return true
            }
        }
    }
}

const cliDisplayHandling = {
    
}

export { crsFunctions }