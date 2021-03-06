import "../sass/styles.scss";
const http = new XMLHttpRequest();
const axios = require('axios');
import 'babel-polyfill';


// -+-+-+-+-+ INITIALIZATION DATEPICKER HOME -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  const minDate = new Date;
  const maxDate = new Date;
  maxDate.setDate(maxDate.getDate() + 365);
  const elems = document.querySelector('.datepickerHome');
  const cont = document.querySelector('.home');
  const instances = M.Datepicker.init(elems, {
    autoClose: true,
    container: cont,
    format: 'dd/mm/yyyy',
    firstDay: 1,
    minDate: minDate,
    maxDate: maxDate
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const minDate = new Date;
  const maxDate = new Date;
  maxDate.setDate(maxDate.getDate() + 365);
  const elems = document.querySelector('.datepickerAdmin');
  const cont = document.querySelector('.adminSect');
  const instances = M.Datepicker.init(elems, {
    autoClose: true,
    container: cont,
    format: 'dd/mm/yyyy',
    firstDay: 1,
    minDate: minDate,
    maxDate: maxDate
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelector('.datepickerProfits');
  const cont = document.querySelector('.admin-section');
  const instances = M.Datepicker.init(elems, {
    autoClose: true,
    container: cont,
    format: 'dd-mm-yyyy',
    firstDay: 1
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelector('.datepickerProfitss');
  const cont = document.querySelector('.admin-section');
  const instances = M.Datepicker.init(elems, {
    autoClose: true,
    container: cont,
    format: 'dd-mm-yyyy',
    firstDay: 1
  });
});


// -+-+-+-+-+ INITIALIZATION TIMEPICKER HOME -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.timepickerAdmin');
  const instances = M.Timepicker.init(elems, {
    twelveHour: false,
    container: '.adminSect',
    defaultTime: 0
  });
});



// -+-+-+-+-+ INITIALIZATION SELECTS -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.select-home');
  var instances = M.FormSelect.init(elems, {
    
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.selectAdmin');
  var instances = M.FormSelect.init(elems, {
  });
});


// -+-+-+-+-+ INITIALIZATION TOOLTIPS OF HOME MAP -+-+-+-+-+
$(document).ready(function() {
  $('.tooltip').tooltipster({
    theme: 'tooltipster-punk',
    contentAsHTML: true,
    animation: 'swing',
    delay: 100,
    interactive: true
  });
});


// -+-+-+-+-+ INITIALIZATION SIDENAV ADMIN -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {
  });
});
// Se configura el botón para mostrar el sideNav
const botonSidenav = document.querySelector('.openButton');
if (botonSidenav) {
  botonSidenav.addEventListener('click', function() {
    const instance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
      instance.open();
  });
}


// -+-+-+-+-+ INITIALIZATION COOLAPSIBLE ADMIN -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {
  });
});


// -+-+-+-+-+ INITIALIZATION MODALS -- Materialize -+-+-+-+-+
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {
    
  });
});


// -+-+-+-+-+ INITIALIZATION BUTTON FOR LOADER IN HOME -+-+-+-+-+
if (document.querySelector('.btnHome')) {
  document.querySelector('.btnHome').addEventListener('click', () => {
    if (document.querySelector('#selectHomeTo').value != '' && document.querySelector('#selectHomeFrom').value != '')
    document.querySelector('.loadingView').style.display = 'block';
  });
}


// -+-+-+-+-+ INITIALIZATION AUTOCOMPLETE -- Materialize -+-+-+-+-+
// Se obtienen todos los Customers para el autocompletado del input de Buyer
axios.get('/getCustomers')
  .then(response => {
    const elems = document.querySelectorAll('.autocompleteBuyer');
    const array = response.data.reduce((acc, cur) => ({...acc, [cur.identityCard]: `https://randomuser.me/api/portraits/${cur.gender === 'Male' ? 'men' : 'women'}/${Math.floor((Math.random() * 100))}.jpg`}), {});
    const instances = M.Autocomplete.init(elems, {
      data: array,
      onAutocomplete: disabledOtherInputsBuyer,
      limit: 3
    });
  }).catch(err => console.log(err));

// Se obtienen todos los Customers del servidor para el autocompletado del input de Passenger
axios.get('/getCustomers')
  .then(response => {
    const elems = document.querySelectorAll('.autocompletePass');
    const array = response.data.reduce((acc, cur) => ({...acc, [cur.identityCard]: `https://randomuser.me/api/portraits/${cur.gender === 'Male' ? 'men' : 'women'}/${Math.floor((Math.random() * 100))}.jpg`}), {});
    const instances = M.Autocomplete.init(elems, {
      data: array,
      onAutocomplete: disabledOtherInputsPass,
      limit: 3
    });
  }).catch(err => console.log(err));
  
const identityC = document.querySelectorAll('#identityCardPur');
const firstName = document.querySelectorAll('#firstNamePur');
const lastName = document.querySelectorAll('#lastNamePur');
const age = document.querySelectorAll('#agePur');
const nationality = document.querySelectorAll('#nationalityPur');
const gender = document.querySelectorAll('#genderPur');
const email = document.querySelectorAll('#emailPur');

const identityCPass = document.querySelectorAll('#identityCardPurPass');
const firstNamePass = document.querySelectorAll('#firstNamePurPass');
const lastNamePass = document.querySelectorAll('#lastNamePurPass');
const agePass = document.querySelectorAll('#agePurPass');
const nationalityPass = document.querySelectorAll('#nationalityPurPass');
const genderPass = document.querySelectorAll('#genderPurPass');
const emailPass = document.querySelectorAll('#emailPurPass');

// Función que se ejecuta cuando se autocompleta el campo de Buyer
function disabledOtherInputsBuyer() {
  // Pedimos la data del Customer que se autocompletó al servidor
  identityC.forEach(element => {
    if (element.value != '') {
      axios.get(`/getCustomer/${element.value}`)
        .then(response => {
          const customerData = response.data[0];
          // Llenamos los campos con la data del Customer y deshabilitamos los campos
          identityC.forEach(element => {
            element.value = customerData.identityCard; element.readOnly = true; element.classList.add('disabledPirata');
          });
          firstName.forEach(element => {
            element.value = customerData.firstName; element.readOnly = true; element.classList.add('disabledPirata');
          });
          lastName.forEach(element => {
            element.value = customerData.lastName; element.readOnly = true; element.classList.add('disabledPirata');
          });
          age.forEach(element => {
            element.value = customerData.age; element.readOnly = true; element.classList.add('disabledPirata');
          });
          email.forEach(element => {
            element.value = customerData.email; element.readOnly = true; element.classList.add('disabledPirata');
          });
          nationality.forEach(element => {
            setSelectBoxByText('nationalityPur', customerData.nationality); element.readOnly = true; element.classList.add('disabledPirata');
          });
          gender.forEach(element => {
            setSelectBoxByText('genderPur', customerData.gender); element.readOnly = true; element.classList.add('disabledPirata');
          });
          // Se le agrega la clase active a los labels de los inputs para quitar bug visual
          document.querySelectorAll('#fre').forEach(entry => {
            entry.classList.add('active');
          });
        }).catch(err => console.log(err));
    }
  });
}

// Función que se ejecuta cuando se autocompleta el campo de Passenger
function disabledOtherInputsPass() {
// Pedimos la data del Customer que se autocompletó al servidor
  identityCPass.forEach(element => {
    if (element.value != '') {
      axios.get(`/getCustomer/${element.value}`)
        .then(response => {
          const customerData = response.data[0];
          // Llenamos los campos con la data del Customer y deshabilitamos los campos
          identityCPass.forEach(element => {
            element.value = customerData.identityCard; element.readOnly = true; element.classList.add('disabledPirata');
          });
          firstNamePass.forEach(element => {
            element.value = customerData.firstName; element.readOnly = true; element.classList.add('disabledPirata');
          });
          lastNamePass.forEach(element => {
            element.value = customerData.lastName; element.readOnly = true; element.classList.add('disabledPirata');
          });
          agePass.forEach(element => {
            element.value = customerData.age; element.readOnly = true; element.classList.add('disabledPirata');
          });
          emailPass.forEach(element => {
            element.value = customerData.email; element.readOnly = true; element.classList.add('disabledPirata');
          });
          nationalityPass.forEach(element => {
            setSelectBoxByText('nationalityPurPass', customerData.nationality); element.readOnly = true; element.classList.add('disabledPirata');
          });
          genderPass.forEach(element => {
            setSelectBoxByText('genderPurPass', customerData.gender); element.readOnly = true; element.classList.add('disabledPirata');
          });
          // Se le agrega la clase active a los labels de los inputs para quitar bug visual
          document.querySelectorAll('#frex').forEach(entry => {
            entry.classList.add('active');
          });
        }).catch(err => console.log(err));
    }
  });
}

// Función para seleccionar una opción en un select
function setSelectBoxByText(eid, optionText) {
  let select = document.querySelectorAll(`#${eid}`);
  select.forEach(ele => {
    for (let i = 0; i < ele.options.length; ++i) {
      if (ele.options[i].text === optionText) {
        ele.options[i].selected = true;
      }
    }
  });
}

// Limpiar los campos con el botón de Clean
if (document.querySelector('#cleanButton')) {
  document.querySelectorAll('#cleanButton').forEach(element => {
    element.addEventListener('click', () => {
      // Limpiamos campos de Buyer
      identityC.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      firstName.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      lastName.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      age.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      email.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      nationality.forEach(ele => {
        ele.selectedIndex = 0; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      gender.forEach(ele => {
        ele.selectedIndex = 0; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      // Limpiamos campos de Passenger
      identityCPass.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      firstNamePass.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      lastNamePass.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      agePass.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      emailPass.forEach(ele => {
        ele.value = ''; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      nationalityPass.forEach(ele => {
        ele.selectedIndex = 0; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      genderPass.forEach(ele => {
        ele.selectedIndex = 0; ele.readOnly = false; ele.classList.remove('disabledPirata');
      });
      // Se le remueve la clase active a los labels de los inputs para quitar bug visual
      document.querySelectorAll('#fre').forEach(entry => {
        entry.classList.remove('active');
      });  
      document.querySelectorAll('#frex').forEach(entry => {
        entry.classList.remove('active');
      });  
    });
  });
}


// -+-+-+-+-+ INITIALIZATION CONTROL BUTTONS OF AIRPORTS MODALS -+-+-+-+-+
if (document.querySelector('#nextForm')) {
  document.querySelectorAll('#nextForm').forEach(elem => {
    elem.addEventListener('click', (e) => {
      document.querySelectorAll('.modalPurchase').forEach(ele => {
        ele.classList.add('rotateActive');
      });
    });
  });
}

if (document.querySelector('#backForm')) {
  document.querySelectorAll('#backForm').forEach(elem => {
    elem.addEventListener('click', (e) => {
      document.querySelectorAll('.modalPurchase').forEach(ele => {
        ele.classList.remove('rotateActive');
      });
    });
  });  
}


// -+-+-+-+-+ INITIALIZATION CHECKBOX BUYERISPASSENGER -+-+-+-+-+
const checkBuyerPassenger = document.querySelectorAll('.buyerIsPassenger');
const passengerInformation = document.querySelectorAll('.passengerInformation');
const frontSide = document.querySelectorAll('.frontSide');
const modalFooter = document.querySelectorAll('.modal-footer');
checkBuyerPassenger.forEach(element => {
  element.addEventListener('click', () => {
    if (element.checked == true) {
      // Si uno esta checked, ponemos todos checked
      checkBuyerPassenger.forEach(ele => {
        ele.checked = true;
      });
      // Se oculta la información del pasajero
      passengerInformation.forEach(ele => {
        ele.style.display = 'none';
      });
      // Se modifica el tamaño de todos los FrontSide
      frontSide.forEach(ele => {
        ele.style.height = '40rem';
      });
      // Se modifica el tamaño de todos los footers de los modals
      modalFooter.forEach(ele => {
        ele.style.marginTop = '5rem';
      });
      
      // Deshabilitamos los campos del passenger para que no se envíen al servidor
      identityCPass.forEach(ele => {
        ele.disabled = true;
      });
      firstNamePass.forEach(ele => {
        ele.disabled = true;
      });
      lastNamePass.forEach(ele => {
        ele.disabled = true;
      });
      agePass.forEach(ele => {
        ele.disabled = true;
      });
      nationalityPass.forEach(ele => {
        ele.disabled = true;
      });
      genderPass.forEach(ele => {
        ele.disabled = true;
      });
      emailPass.forEach(ele => {
        ele.disabled = true;
      });
    } else {
      // Si uno esta no checked, ponemos todos no checked
      checkBuyerPassenger.forEach(ele => {
        ele.checked = false;
      });
      // Se muestra la información del pasajero
      passengerInformation.forEach(ele => {
        ele.style.display = 'block';
      });
      // Se modifica el tamaño de todos los FrontSide
      frontSide.forEach(ele => {
        ele.style.height = '52rem';
      });
      // Se modifica el tamaño de todos los footers de los modals
      modalFooter.forEach(ele => {
        ele.style.marginTop = '0';
      });
  
      // Habilitamos los campos del passenger para que se envíen al servidor
      identityCPass.forEach(ele => {
        ele.disabled = false;
      });
      firstNamePass.forEach(ele => {
        ele.disabled = false;
      });
      lastNamePass.forEach(ele => {
        ele.disabled = false;
      });
      agePass.forEach(ele => {
        ele.disabled = false;
      });
      nationalityPass.forEach(ele => {
        ele.disabled = false;
      });
      genderPass.forEach(ele => {
        ele.disabled = false;
      });
      emailPass.forEach(ele => {
        ele.disabled = false;
      });
    }
  });
});

// Selects Seats
// const selectsSeats = document.querySelectorAll('.selectSeats');

// selectsSeats.forEach(element => {
//   const id = element.getAttribute('id');
//   const flightCode = id.split('selectSeat')[1];

//   axios.get(`/getEmptySeats/${flightCode}`)
//   .then(response => {

//     const asientosOcupados = [];
//     response.data.forEach(ele => {
//       asientosOcupados.push(ele.seatNumber);
//     });

//     for (let i = 0; i < 38; i++) {
//       if (!asientosOcupados.includes('' + (i + 1))) {
//         const opt = document.createElement('option');
//         opt.value = i + 1;
//         opt.innerHTML = i + 1;
//         element.appendChild(opt);
//       }
//     }
//   }).catch(err => console.log(err));
// });


// -+-+-+-+-+ INITIALIZATION SEATSMAP OF AIRPORTS -+-+-+-+-+
$(document).ready(function() {
	document.querySelectorAll('.seatMaps').forEach(el => {
    let firstSeatLabel = 1;
    let firstSeatLabel2 = 1;  
    console.log(el.getAttribute('id'));
    var sc = $(`#${el.getAttribute('id')}`).seatCharts({
      map: [
        'aa_aa',
        'aa_aa',
        'bb_bb',
        'bb_bb',
        'bb___',
        'bb_bb',
        'bb_bb',
        'bb_bb',
        'bbbbb'
      ],
      seats: {
        a: {
          classes : 'business' //your custom CSS class
        },
        b: {
          classes : 'economic' //your custom CSS class
        }
      },
      naming: {
        top: false,
        left: false,
        getLabel: function (character, row, column) {
          return firstSeatLabel++;
        },
        getId: function(character, row, column) {
          return firstSeatLabel2++;
        }
      },
      click: function () {
        if (this.status() == 'available') {
          // Ponemos unavailable todos los asientos excepto el escogido
          const id = this.settings.id;
          for (let i = 1; i <=35; i++) {
            if (i != id) {
              sc.get('' + i).status('unavailable');
            }
          }
          // Llenamos el input hidden del asiento seleccionado
          document.querySelector(`#seatNum_${numRandom}_${flightCode}`).value = id;
          // Habilitamos el botón de Purchase
          document.querySelectorAll('#buttonPurchaseTicket').forEach(ele => {
            ele.disabled = false;
          });
          return 'selected';

        } else if (this.status() == 'selected') {
          // Ponemos todos los asientos available excepto los que ya están vendidos
          document.querySelectorAll('.loaderSeatMap').forEach(ele => {
            ele.style.display = 'block';
          });
          axios.get(`/getEmptySeats/${flightCode}`)
            .then(response => {
              const asientosOcupados = [];
              response.data.forEach(ele => {
                asientosOcupados.push(ele.seatNumber);
              });
              const id = this.settings.id;
              for (let i = 1; i <=35; i++) {
                if (!asientosOcupados.includes('' + i)) {
                  sc.get('' + i).status('available');
                }
              }
              // Vaciamos el input hidden del asiento seleccionado
              document.querySelector(`#seatNum_${numRandom}_${flightCode}`).value = '';
              document.querySelectorAll('.loaderSeatMap').forEach(ele => {
                ele.style.display = 'none';
              });
              // Habilitamos el botón de Purchase
              document.querySelectorAll('#buttonPurchaseTicket').forEach(ele => {
                ele.disabled = true;
              });
            }).catch(err => console.log(err));
          return 'available';
        } else if (this.status() == 'unavailable') {
          //seat has been already booked
          return 'unavailable';
        } else {
          return this.style();
        }
      }
    });
  
    // Inhabilitar los que ya están comprados
    const id = el.getAttribute('id');
    const flightCode = id.split('_')[2];
    const numRandom = id.split('_')[1];
    axios.get(`/getEmptySeats/${flightCode}`)
    .then(response => {
      const asientosOcupados = [];
      response.data.forEach(ele => {
        asientosOcupados.push(ele.seatNumber);
      });
      for (let i = 1; i <= 35; i++) {
        if (asientosOcupados.includes('' + i)) {
          sc.get('' + i).status('unavailable');
        }
      }
    }).catch(err => console.log(err));
  });
});


// -+-+-+-+-+ INITIALIZATION TABLES ADMIN -+-+-+-+-+
$(document).ready( function () {
  $('#tablePlanningFlights').DataTable({
    "lengthMenu": [5, 10, 20, 50]
  });
} );


// -+-+-+-+-+ INITIALIZATION AND FUNCTIONALITY OF SELECT FROM FLIGHTS ADMIN -+-+-+-+-+
if (document.querySelector('.selectFlightRoute')) {
  document.querySelector('.selectFlightRoute').disabled = true;

  document.querySelector('.selectFlightAirplane').addEventListener('change', () => {
    const airplaneIdChanged = document.querySelector('.selectFlightAirplane').value;
    document.querySelector('.selectFlightRoute').disabled = true;

    axios.get(`/getAirplaneRoutes/${airplaneIdChanged}`)
      .then(response => {
        document.querySelector('.selectFlightRoute').innerHTML = '';

        const opt = document.createElement('option');
        opt.value = '';
        opt.disabled = true;
        opt.selected = true;
        opt.innerHTML = 'Select Company Airplane';
        document.querySelector('.selectFlightRoute').appendChild(opt);

        for (let i = 0; i < response.data.airplaneRoutes.length; i++) {
          const opt = document.createElement('option');
          opt.value = response.data.airplaneRoutes[i].routeId;
          opt.innerHTML = `${response.data.airplaneRoutes[i].routeId} ➡ ${response.data.airplaneRoutes[i].origin}-${response.data.airplaneRoutes[i].destiny}`;
          document.querySelector('.selectFlightRoute').appendChild(opt);
        }

        document.querySelector('.selectFlightRoute').disabled = false;
      }).catch(err => console.log(err));
  });
}


// -+-+-+-+-+ INITIALIZATION STATISTICS OF ADMIN VIEW -+-+-+-+-+
axios.get(`/getTicketsSold`)
  .then(response => {
    if (document.querySelector('#cantTicketsSold')) {
      const cantTicketsSoldP = document.querySelector('#cantTicketsSold');
      cantTicketsSoldP.innerHTML = response.data.ticketsSold[0].cant;
    }
  }).catch(err => console.log(err.response));

axios.get(`/getFlightsOverbooking`)
  .then(response => {
    if (document.querySelector('#flightsOverbooking')) {
      const cantflightsOverbooking = document.querySelector('#flightsOverbooking');
      cantflightsOverbooking.innerHTML = response.data.flightsOverbooking[0].cant;
    }
  }).catch(err => console.log(err.response));

axios.get(`/getFlightsOverbookingPercentage`)
  .then(response => {
    if (document.querySelector('#flightsOverbookingPercentage')) {
      const cantflightsOverbooking = document.querySelector('#flightsOverbookingPercentage');
      cantflightsOverbooking.innerHTML = (response.data.flightsOverbookingPercentage);
    }
  }).catch(err => console.log(err.response));

axios.get(`/getTotalProfits`)
  .then(response => {
    if (document.querySelector('#totalProfits')) {
      const totalProfits = document.querySelector('#totalProfits');
      totalProfits.innerHTML = response.data.profits[0].profits;
    }
  }).catch(err => console.log(err.response));

if (document.querySelector('#findIntervalProfit')) {
  document.querySelector('#findIntervalProfit').addEventListener('click', () => {
  const date1 = document.querySelector('#intervalProfit1').value;
  const date2 = document.querySelector('#intervalProfit2').value;

  axios.get(`/getProfitOnInterval/${date1}/${date2}`)
    .then(response => {
      document.querySelector('#intervalProfit').innerHTML = response.data.profits[0].profits;
    }).catch(err => console.log(err.response));
  })
}






// -+-+-+-+-+ INITIALIZATION CHART OF ADMIN VIEW -+-+-+-+-+
if (document.getElementById("chart1")) {

  (async function initChart1() {
    const enero = await axios.get(`/getNumberFlights/01`);
    const febrero = await axios.get(`/getNumberFlights/02`);
    const marzo = await axios.get(`/getNumberFlights/03`);
    const abril = await axios.get(`/getNumberFlights/04`);
    const mayo = await axios.get(`/getNumberFlights/05`);
    const junio = await axios.get(`/getNumberFlights/06`);
    const julio = await axios.get(`/getNumberFlights/07`);
    const agosto = await axios.get(`/getNumberFlights/08`);
    const septiembre = await axios.get(`/getNumberFlights/09`);
    const octubre = await axios.get(`/getNumberFlights/10`);
    const noviembre = await axios.get(`/getNumberFlights/11`);
    const diciembre = await axios.get(`/getNumberFlights/12`);
  
    const ctx = document.getElementById("chart1");
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"],
            datasets: [{
                label: "Flights per Month",
                backgroundColor: '#2BBBAD',
                borderColor: '#2BBBAD',
                data: [enero.data[0].cant, febrero.data[0].cant, marzo.data[0].cant, abril.data[0].cant, mayo.data[0].cant, junio.data[0].cant, julio.data[0].cant, agosto.data[0].cant, septiembre.data[0].cant, octubre.data[0].cant, noviembre.data[0].cant, diciembre.data[0].cant],
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart1').style.display = 'none';
  })();
  
  (async function initChart2() {
    const airplanes = await axios.get(`/getDifferentsAirplanes`);
    let arrayAirplanes = [];
    (airplanes.data).forEach(element => {
      arrayAirplanes.push(`${element.id} ~ ${element.model}`);
    });
  
    const flightsAirplanes = await axios.get(`/getFlightsPerAirplane`);
    let arrayFlights = [];
      (flightsAirplanes.data).forEach(element => {
        arrayFlights.push(element.cant);
      });
  
    const ctx = document.getElementById("chart2");
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayAirplanes,
            datasets: [{
                label: "Flights per Airplane",
                backgroundColor: '#2BBBAD',
                borderColor: '#2BBBAD',
                data: arrayFlights,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart2').style.display = 'none';
  })();
  
  (async function initChart3() {
    const ticketsAirports = await axios.get(`/getCantTicketsPerAirport`);
    let arrayTickets = [];
      (ticketsAirports.data).forEach(element => {
        arrayTickets.push(element.cant);
      });
  
    const ctx = document.getElementById("chart3");
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["ATL", "CCS", "CDG", "DXB", "JFK", "MIA"],
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: '#2BBBAD',
                borderColor: '#2BBBAD',
                data: arrayTickets,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart3').style.display = 'none';
  })();
  
  (async function initChart4() {
    const airplanes = await axios.get(`/getDifferentsAirplanes`);
    let arrayAirplanes = [];
    (airplanes.data).forEach(element => {
      arrayAirplanes.push(`${element.id} ~ ${element.model}`);
    });
  
    const weightAirplane = await axios.get(`/getAverageWeightPerAirplane`);
    let arrayWeights = [];
    (weightAirplane.data).forEach(element => {
      arrayWeights.push(element.promedio);
    });
  
    const ctx = document.getElementById("chart4");
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayAirplanes,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: '#2BBBAD',
                borderColor: '#2BBBAD',
                data: arrayWeights,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart4').style.display = 'none';
  })();
  
  (async function initChart5() {
    const airplanes = await axios.get(`/getDifferentsAirplanes`);
    let arrayAirplanes = [];
    (airplanes.data).forEach(element => {
      arrayAirplanes.push(`${element.id} ~ ${element.model}`);
    });

    const airplaneUse = await axios.get(`/getUseOfAirplanes`);
    let arrayAirplanesUse = [];
    (airplaneUse.data).forEach(element => {
      arrayAirplanesUse.push(element.vuelos * 100);
    });
  
    const ctx = document.getElementById("chart5");
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: arrayAirplanes,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: [
                  '#2BBBAD',
                  '#9BBBAC',
                  '#1B9BAD',
                  '#2B7BAD',
                  '#2BBBAD',
                  '#2BBB0D',
                  '#CCB4A1',
                  '#DC3A11',
                  '#DC3AA1',
                  '#AC3AF6'
                ],
                borderColor: [
                  '#2BBBAD',
                  '#9BBBAC',
                  '#1B9BAD',
                  '#2B7BAD',
                  '#2BBBAD',
                  '#2BBB0D',
                  '#CCB4A1',
                  '#DC3A11',
                  '#DC3AA1',
                  '#AC3AF6'
                ],
                data: arrayAirplanesUse,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart5').style.display = 'none';
  })();
  
  (async function initChart6() {
    const airplanes = await axios.get(`/getAirplanesPerState`);
    let arrayCant = [];
    let arrayStates = [];
    (airplanes.data).forEach(element => {
      arrayCant.push(element.cant);
      arrayStates.push(element.state)
    });
  
    const ctx = document.getElementById("chart6");
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: arrayStates,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#1B9BAD',
                  '#DC3AA1',
                  '#DC3A11',
                  '#9BBBAC',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#2B7BAD',
                  '#2BBB0D'
                ],
                borderColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#1B9BAD',
                  '#DC3AA1',
                  '#DC3A11',
                  '#9BBBAC',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#2B7BAD',
                  '#2BBB0D'
                ],
                data: arrayCant,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart6').style.display = 'none';
  })();
  
  (async function initChart7() {
    const stats = await axios.get(`/getPeopleVsAge`);
    let arrayAge = [];
    let arrayCant = [];
    (stats.data).forEach(element => {
      arrayCant.push(element.totalCustomers);
      arrayAge.push(element.age)
    });
  
    const ctx = document.getElementById("chart7");
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: arrayAge,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#1B9BAD',
                  '#DC3AA1',
                  '#DC3A11',
                  '#9BBBAC',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#2B7BAD',
                  '#2BBB0D'
                ],
                borderColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#1B9BAD',
                  '#DC3AA1',
                  '#DC3A11',
                  '#9BBBAC',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#2B7BAD',
                  '#2BBB0D'
                ],
                data: arrayCant,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart7').style.display = 'none';
  })();
  
  (async function initChart8() {
    const stats = await axios.get(`/getPeopleVsNationality`);
    let arrayNationality = [];
    let arrayCant = [];
    (stats.data).forEach(element => {
      arrayCant.push(element.totalCustomers);
      arrayNationality.push(element.nationality)
    });
  
    const ctx = document.getElementById("chart8");
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: arrayNationality,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#2B7BAD',
                  '#AC3AF6',
                  '#2BBB0D',
                  '#1B9BAD',
                  '#9BBBAC',
                  '#DC3A11',
                  '#DC3AA1',
                  '#2BBBAD',
                ],
                borderColor: [
                  '#CCB4A1',
                  '#2BBBAD',
                  '#2B7BAD',
                  '#AC3AF6',
                  '#2BBB0D',
                  '#1B9BAD',
                  '#9BBBAC',
                  '#DC3A11',
                  '#DC3AA1',
                  '#2BBBAD',
                ],
                data: arrayCant,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart8').style.display = 'none';
  })();
  
  (async function initChart9() {
    const stats = await axios.get(`/getPeopleVsGender`);
    let arrayGender = [];
    let arrayCant = [];
    (stats.data).forEach(element => {
      arrayCant.push(element.totalCustomers);
      arrayGender.push(element.gender)
    });
  
    const ctx = document.getElementById("chart9");
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: arrayGender,
            datasets: [{
                label: "Tickets per Airport",
                backgroundColor: [
                  '#CCB4A1',
                  '#2B7BAD',
                  '#2BBB0D',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#DC3AA1',
                  '#1B9BAD',
                  '#2BBBAD',
                  '#DC3A11',
                  '#9BBBAC',
                ],
                borderColor: [
                  '#CCB4A1',
                  '#2B7BAD',
                  '#2BBB0D',
                  '#2BBBAD',
                  '#AC3AF6',
                  '#DC3AA1',
                  '#1B9BAD',
                  '#2BBBAD',
                  '#DC3A11',
                  '#9BBBAC',
                ],
                data: arrayCant,
            }]
        },
        options: {}
      });
  
      document.querySelector('.loaderChart9').style.display = 'none';
  })();

}

















// -+-+-+-+-+ VALIDACIÓN DEL CONFIRM PASSWORD DE REGISTER -+-+-+-+-+
const confirmPassRegister = document.getElementById('confirmpasswordRegister');
const passRegister = document.getElementById('passwordRegister');

if (confirmPassRegister !== null && passRegister !== null) {
  confirmPassRegister.addEventListener('keyup', () => {
    if (passRegister.value === confirmPassRegister.value) {
      confirmPassRegister.setCustomValidity('');
    } else {
      confirmPassRegister.setCustomValidity('Passwords must match');
    }
  });
  
  let cont = 0;
  passRegister.addEventListener('keyup', function() {
    cont = passRegister.value.length;
    console.log(cont);
  
    if (cont >= 6) {
      confirmPassRegister.disabled = false;
    } else {
      confirmPassRegister.disabled = true;
      confirmPassRegister.value = '';
    }
  });
}


