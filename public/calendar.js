const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const calendar_container = document.getElementById("calendar-container");

const date = new Date();

console.log(date);

document.getElementById("calendar-month-year").innerHTML = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

let daysOfMonth;
switch (date.getMonth() + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        daysOfMonth = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        daysOfMonth = 30;
        break;
    case 2:
        if ((date.getYear % 4) == 0) {
            daysOfMonth = 29;
        } else { daysOfMonth = 28; }
        break;
    default:
        daysOfMonth = -1;
        break;
}

console.log(daysOfMonth);


let startDate = date.getDate();
let startDay = date.getDay();

while (startDate > 7) {
    startDate -= 7;
}

while (startDate > 1) {
    startDate--;
    startDay--;
    if (startDay < 0) { startDay = 6; }
}

const calendarTable = document.getElementById("calendar-table-body");

let daysCount = 0;
let week = 0;

if (startDay > 0) {
    calendarTable.children[week].innerHTML = `<td colspan="${startDay}"></td>`
    daysCount = startDay;
}

for (let i = 0; i < daysOfMonth; i++) {
    if (daysCount == 7) {
        week++;
        daysCount = 0;
    }
    
    if (date.getDate() == (i + 1)) {
        calendarTable.children[week].innerHTML += `<td class="table-secondary">${i + 1}</td>`;
    } else{ calendarTable.children[week].innerHTML += `<td>${i + 1}</td>`; }
    daysCount++;
    
}