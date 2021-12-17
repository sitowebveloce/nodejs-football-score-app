// Select Container and footer
const container = document.querySelector('.container');
const footer = document.querySelector('footer');

// Import Fetch Function
import { getFootball } from "./getFootball.js";
// APP INIT
const initApp = async() => {
    console.log('Ready');
    // GET
    let data = await getFootball();
    // console.log(data);
    if (data.data !== [] && data.message === 'Success') {
        appendData(data.data);
    } else {
        alert('Please verify data input file.')
    };
};
// Dom Loaded Event
document.addEventListener('DOMContentLoaded', initApp);

// Append Function
async function appendData(data) {
    // console.log(data);

    // Reset View first
    container.innerHTML = '';

    // Show
    let count = 1
    data.forEach(f => {
                // console.log(f);
                // Create a div
                let div = document.createElement('div');
                if (count === 1) {
                    div.classList.add('card');
                    div.classList.add('big');
                } else {
                    div.classList.add('card');
                }
                // Inner HTML
                div.innerHTML = `
                <div class='card_team'>${f.team}</div>
                <div class='card_f'>${f.team === 'Team' ? 'F = Goals' : `F: ${f.f}`}</div>        
                <div class='card_a'>${f.team === 'Team' ? 'A = Conceded' : `A: ${f.a}`}</div>        
                <div class='card_diff'>${f.team === 'Team' ? 'Diff = Difference' : `Diff: ${f.diff}`}</div>        
                `;
                // Append
                container.appendChild(div);
                // Increment
                count++
    })
};

// Footer Year
const d = new Date();
let year = d.getFullYear();
footer.innerHTML = `
<small> &copy; @iscs ${year}</small>
`;