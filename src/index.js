// Module imports
import process from 'process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import readline from 'node:readline';

// Custom Function Imports
import { getDepartures, getArrivals } from './fetchData.js';
import { crsFunctions } from './utils.js';

console.log(`Welcome to the ${chalk.green('LiveRail')} CLI`)
menu()

function menu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'Menu',
                message: 'Please select an option from below',
                choices: [
                    {
                        value: 'DEP',
                        name: 'Check departures',
                        description: 'Check the information of departing trains from a station.'
                    },
                    {
                        value: 'ARR',
                        name: 'Check arrivals',
                        description: 'Check the information of arriving trains from a station.'
                    },
                    new inquirer.Separator(),
                    {
                        value: 'EXT',
                        name: 'Exit the application',
                    }
                ]
            },
            {
                type: 'input',
                name: 'LOC',
                message: 'Please enter the name or CRS code of the target station',
                filter(val) {
                    if (crsFunctions.authenticateCRS(val.toUpperCase())) {
                        return val.toUpperCase()
                    } else {
                        return crsFunctions.searchCRS(val)
                    }
                },
                when(answers) {
                    if (answers.Menu == 'DEP' || answers.Menu == 'ARR') {
                        return true
                    } else {
                        return false
                    }
                }
            }
        ])
        .then((answers) => {
            switch (answers.Menu) {
                case 'DEP':
                    getDepartures(answers.LOC)
                        .then(departureData => {
                            main(departureData, 'DEP');
                        })
                        .catch(error => console.error(error));
                    break;
                case 'ARR':
                    getArrivals(answers.LOC)
                        .then(arrivalData => {
                            main(arrivalData, 'ARR')
                        })
                        .catch(error => console.error(error));
                    break;
                case 'EXT':
                    console.log(`Thank you for using the ${chalk.green('LiveRail')} CLI. Goodbye!`)
                    process.exit(1)
            }
        })
}

function prepareData(data, mode) {
    let rows = []
    let headerRow = ['No.', 'Operator', "X", 'Expected', 'Plat', 'Origin', 'Dest']
    if (mode === 'DEP') {
        headerRow[2] = 'Departure'
    } else if (mode === 'ARR') {
        headerRow[2] = 'Arrival'
    }
    
    rows.push(headerRow)

    for (let i = 0; i < data.trainServices.length; i++) {
        let service = data.trainServices[i]

        let platform = service.platform || 'N/A'

        let rowData = [
            i+1,
            service.operator,
            service.std || service.sta,
            service.etd || service.eta,
            platform,
            service.origin[0].locationName,
            service.destination[0].locationName
        ]
        rows.push(rowData)
    }

    return rows;
}

function displayTableData(data) {
    if (data.length === 0) {
        console.log('No data to print.');
        return;
    }

    const max_lengths = data[0].map((_, i) => Math.max(...data.map(row => String(row[i]).length)));

    let tableStr = '';
    data.forEach(row => {
        let rowStr = row.map((item, i) => item.toString().padEnd(max_lengths[i] + 5)).join('');
        tableStr += rowStr + '\n';
    });

    console.log(tableStr);
}

function main(data, mode) {
    const preparedData = prepareData(data, mode);
    displayTableData(preparedData);

    if (data.nrccMessages) {
        for (let message of data.nrccMessages) {
            if (message.value) {
                let cleanMessage = message.value.replace('\n' + ' ', '');
                console.log(cleanMessage);
            }
        }
    }

    const rlInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rlInterface.question('Press any key to show the menu...', () => {
        menu()
    });
}
