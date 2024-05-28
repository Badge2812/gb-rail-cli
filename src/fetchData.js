import axios from 'axios';
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('src/config.json', 'utf8'));

export function getDepartures(crs) {
    return axios.get(`https://api1.raildata.org.uk/1010-live-departure-board-dep/LDBWS/api/20220120/GetDepBoardWithDetails/${crs}`,
        {
            headers: {
                'x-apikey': config.departureAuth
            }
        }
    )
    .then(function (res) {
        return res.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getArrivals(crs) {
    // HTTP 500 - Need to check stuff once website is back up
    return axios.get(`https://api1.raildata.org.uk/1010-live-arrival-board-arr/LDBWS/api/20220120/GetArrBoardWithDetails/${crs}`,
        {
            headers: {
                'x-apikey': config.arrivalAuth
            }
        }
    )
    .then(function (res) {
        return res.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}