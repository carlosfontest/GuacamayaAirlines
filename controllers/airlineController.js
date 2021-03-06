const sequelize = require("../config/database");
const Customer = require("../models/Customer");
const FlightTicket = require("../models/FlightTicket");
const FlightTicket_Flights = require("../models/FlightTicket_Flights");

exports.viewHome = (req, res) => {
  res.render("home", { title: 'home' });
};

exports.viewLogin = (req, res) => {
  res.render("login", { title: 'login' });
};

exports.viewRegister = (req, res) => {
  res.render("register", { title: 'register' });
};

exports.viewDashboard = (req, res) => {
  res.render("dashboard", { title: 'dashboard' });
};

exports.viewAirport = (req, res) => {
  const iata = req.params.iata.toUpperCase();
  if (iata !== 'MIA' && iata !== 'CCS' && iata !== 'JFK' && iata !== 'ATL' && iata !== 'CDG' && iata !== 'DXB') {
    req.flash('error', 'This airport does not exists.');
    req.session.save(function () {
      res.redirect('/');
    });
  } else {
    let airport = {};

    sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${iata}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };

        return sequelize.query(`
          SELECT Flights.code, Routes.origin, Routes.destiny, Flights.date, Routes.basePrice
          FROM Flights
          INNER JOIN Routes ON Flights.routeId = Routes.id
          WHERE Routes.origin = '${iata}' OR Routes.destiny = '${iata}'
        `, { type: sequelize.QueryTypes.SELECT });
      })
      .then(result => {
        airport.flights = result;
        let flightsCrack = [];
        airport.flights.forEach(elem => {
          const xd = [];
          xd.push(elem);
          flightsCrack.push(xd);
        });
        airport.flights = flightsCrack;
        res.render("airport", { title: 'airport', airport });
      })
      .catch(err => console.log(err));
  }
};

exports.viewAirport = (req, res) => {
  const iata = req.params.iata.toUpperCase();
  if (iata !== 'MIA' && iata !== 'CCS' && iata !== 'JFK' && iata !== 'ATL' && iata !== 'CDG' && iata !== 'DXB') {
    req.flash('error', 'This airport does not exists.');
    req.session.save(function () {
      res.redirect('/');
    });
  } else {
    let airport = {};

    sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${iata}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };

        return sequelize.query(`
          SELECT Flights.code, Routes.origin, Routes.destiny, Flights.date, Routes.basePrice
          FROM Flights
          INNER JOIN Routes ON Flights.routeId = Routes.id
          WHERE Routes.origin = '${iata}' OR Routes.destiny = '${iata}'
        `, { type: sequelize.QueryTypes.SELECT });
      })
      .then(result => {
        airport.flights = result;
        let flightsCrack = [];
        airport.flights.forEach(elem => {
          const xd = [];
          xd.push(elem);
          flightsCrack.push(xd);
        });
        airport.flights = flightsCrack;
        res.render("airport", { title: 'airport', airport });
      })
      .catch(err => console.log(err));
  }
};

exports.searchFlights = (req, res) => {
  if (req.body.from === req.body.to) {
    req.flash('error', 'Can\'t search a flight with same origin and destiny.');
    req.session.save(function () {
      res.redirect('/');
    });
    return;
  }

  const from = req.body.from;
  const to = req.body.to;
  const dateDepart = req.body.dateDepart;
  const [day, month, year] = dateDepart.split('/');
  const newdate = `${year}-${month}-${day}`;
  const scales = req.body.scales;


  if (req.body.from && req.body.to && !req.body.dateDepart && !req.body.scales) { // From, To, NoScales
    sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${to}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata: to,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };

        return sequelize.query(`
          SELECT Flights.code, Routes.origin, Routes.destiny, Flights.date, Routes.basePrice
          FROM Flights
          INNER JOIN Routes ON Flights.routeId = Routes.id
          WHERE Routes.origin = '${from}' AND Routes.destiny = '${to}'
        `, { type: sequelize.QueryTypes.SELECT });
      })
      .then(result => {
        airport.flights = result;
        if (airport.flights.length === 0) {
          req.flash('info', 'Not found flights like that.');
          req.session.save(function () {
            res.redirect('/');
          });
        } else {
          let flightsCrack = [];
          airport.flights.forEach(elem => {
            const xd = [];
            xd.push(elem);
            flightsCrack.push(xd);
          });
          airport.flights = flightsCrack;

          res.render("airport", { title: 'airport', airport });
        }
      })
      .catch(err => console.log(err));

  } else if (req.body.from && req.body.to && req.body.dateDepart && !req.body.scales) { // From, To, Date, NoScales
    sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${to}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata: to,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };

        return sequelize.query(`
          SELECT Flights.code, Routes.origin, Routes.destiny, Flights.date, Routes.basePrice
          FROM Flights
          INNER JOIN Routes ON Flights.routeId = Routes.id
          WHERE Routes.origin = '${from}' AND Routes.destiny = '${to}' AND Flights.date >= '${newdate} 00:00:00' AND Flights.date <= '${newdate} 23:59:59'
        `, { type: sequelize.QueryTypes.SELECT });
      })
      .then(result => {
        airport.flights = result;
        if (airport.flights.length === 0) {
          req.flash('info', 'Not found flights like that.');
          req.session.save(function () {
            res.redirect('/');
          });
        } else {
          let flightsCrack = [];
          airport.flights.forEach(elem => {
            const xd = [];
            xd.push(elem);
            flightsCrack.push(xd);
          });
          airport.flights = flightsCrack;
          res.render("airport", { title: 'airport', airport });
        }
      })
      .catch(err => console.log(err));

  } else if (req.body.from && req.body.to && !req.body.dateDepart && req.body.scales) { // From, To, Scales
    sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${to}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata: to,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };
        airport.flights = [];
        // #######################################################################################################
        // ######################## PRIMER GENERADOR DE NUMEROS DE RUTAS PARA DOS ESCALAS ########################
        // #######################################################################################################
        sequelize.query(`
          SELECT a.id as ruta1, b.id as ruta2
          FROM Routes as a
          JOIN Routes as b
          WHERE (a.destiny = b.origin) AND (a.origin = '${from}') AND (b.destiny = '${to}')
        `, { type: sequelize.QueryTypes.SELECT })
          .then(result => {
            const ruta11 = result[0].ruta1;
            const ruta12 = result[0].ruta2;
              const ruta21 = result[1].ruta1;
              const ruta22 = result[1].ruta2;
                const ruta31 = result[2].ruta1;
                const ruta32 = result[2].ruta2;
                  const ruta41 = result[3].ruta1;
                  const ruta42 = result[3].ruta2;
            // VUELOS CON ESCALA (UTILIZAR NUMEROS DE RUTA GENERADOS POR EL QUERY GENERADOR DE RUTAS)
            sequelize.query(`
              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
              FROM Flights AS a
              JOIN Flights AS b 
              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta11}) + 2 HOUR) 
              AND (a.routeId = ${ruta11}) AND (b.routeId = ${ruta12}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta11}) + 24 HOUR > b.date)
            `, { type: sequelize.QueryTypes.SELECT })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });

                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta21}) + 2 HOUR) 
                AND (a.routeId = ${ruta21}) AND (b.routeId = ${ruta22}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta21}) + 24 HOUR > b.date)
              `, { type: sequelize.QueryTypes.SELECT })

              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });

                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta31}) + 2 HOUR) 
                AND (a.routeId = ${ruta31}) AND (b.routeId = ${ruta32}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta31}) + 24 HOUR > b.date)
              `, { type: sequelize.QueryTypes.SELECT })
              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });

                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta41}) + 2 HOUR) 
                AND (a.routeId = ${ruta41}) AND (b.routeId = ${ruta42}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta41}) + 24 HOUR > b.date)
              `, { type: sequelize.QueryTypes.SELECT })
              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });
                sequelize.query(`
                  SELECT a.id as ruta1, b.id as ruta2, c.id as ruta3
                  FROM Routes as a
                  JOIN Routes as b
                  JOIN Routes as c
                  WHERE (a.destiny = b.origin) AND (b.destiny = c.origin) AND (a.origin = '${from}') AND (c.destiny = '${to}') AND (a.origin != b.destiny) AND (c.destiny != b.origin)
                `, { type: sequelize.QueryTypes.SELECT })
                  .then(result => {
                    const ruta11 = result[0].ruta1;
                    const ruta12 = result[0].ruta2;
                    const ruta13 = result[0].ruta3;
                      const ruta21 = result[1].ruta1;
                      const ruta22 = result[1].ruta2;
                      const ruta23 = result[1].ruta3;
                        const ruta31 = result[2].ruta1;
                        const ruta32 = result[2].ruta2;
                        const ruta33 = result[2].ruta3;
                          const ruta41 = result[3].ruta1;
                          const ruta42 = result[3].ruta2;
                          const ruta43 = result[3].ruta3;
                            const ruta51 = result[4].ruta1;
                            const ruta52 = result[4].ruta2;
                            const ruta53 = result[4].ruta3;
                              const ruta61 = result[5].ruta1;
                              const ruta62 = result[5].ruta2;
                              const ruta63 = result[5].ruta3;
                                const ruta71 = result[6].ruta1;
                                const ruta72 = result[6].ruta2;
                                const ruta73 = result[6].ruta3;
                                  const ruta81 = result[7].ruta1;
                                  const ruta82 = result[7].ruta2;
                                  const ruta83 = result[7].ruta3;
                                    const ruta91 = result[8].ruta1;
                                    const ruta92 = result[8].ruta2;
                                    const ruta93 = result[8].ruta3;
                                      const ruta101 = result[9].ruta1;
                                      const ruta102 = result[9].ruta2;
                                      const ruta103 = result[9].ruta3;
                                        const ruta111 = result[10].ruta1;
                                        const ruta112 = result[10].ruta2;
                                        const ruta113 = result[10].ruta3;
                                          const ruta121 = result[11].ruta1;
                                          const ruta122 = result[11].ruta2;
                                          const ruta123 = result[11].ruta3;
                    const array1 = [ruta11, ruta21, ruta31, ruta41, ruta51, ruta61, ruta71, ruta81, ruta91, ruta101, ruta111, ruta121];
                    const array2 = [ruta12, ruta22, ruta32, ruta42, ruta52, ruta62, ruta72, ruta82, ruta92, ruta102, ruta112, ruta122];
                    const array3 = [ruta13, ruta23, ruta33, ruta43, ruta53, ruta63, ruta73, ruta83, ruta93, ruta103, ruta113, ruta123];
                    sequelize.query(`
                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                      FROM Flights AS a
                      JOIN Flights AS b 
                      JOIN Flights AS c
                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[0]} ) + 2 HOUR) 
                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[0]} ) + 2 HOUR) 
                      AND (a.routeId = ${array1[0]} ) AND (b.routeId = ${array2[0]} ) AND (c.routeId = ${array3[0]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[0]}) + 24 HOUR > b.date)
                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[0]}) + 24 HOUR > c.date)
                    `, { type: sequelize.QueryTypes.SELECT })
                      .then(result => {
                        result.forEach(element => {
                          let flightsCrack = [];
                          flightsCrack.push({
                            code: element.code_1,
                            origin: element.origin_1,
                            destiny: element.destiny_1,
                            date: element.date_1,
                            basePrice: element.price_1
                          });
                          flightsCrack.push({
                            code: element.code_2,
                            origin: element.origin_2,
                            destiny: element.destiny_2,
                            date: element.date_2,
                            basePrice: element.price_2
                          });
                          flightsCrack.push({
                            code: element.code_3,
                            origin: element.origin_3,
                            destiny: element.destiny_3,
                            date: element.date_3,
                            basePrice: element.price_3
                          });
                          airport.flights.push(flightsCrack);
                        });
                        sequelize.query(`
                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                          FROM Flights AS a
                          JOIN Flights AS b 
                          JOIN Flights AS c
                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[1]} ) + 2 HOUR) 
                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[1]} ) + 2 HOUR) 
                          AND (a.routeId = ${array1[1]} ) AND (b.routeId = ${array2[1]} ) AND (c.routeId = ${array3[1]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[1]}) + 24 HOUR > b.date)
                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[1]}) + 24 HOUR > c.date)
                        `, { type: sequelize.QueryTypes.SELECT })
                          .then(result => {
                            result.forEach(element => {
                              let flightsCrack = [];
                              flightsCrack.push({
                                code: element.code_1,
                                origin: element.origin_1,
                                destiny: element.destiny_1,
                                date: element.date_1,
                                basePrice: element.price_1
                              });
                              flightsCrack.push({
                                code: element.code_2,
                                origin: element.origin_2,
                                destiny: element.destiny_2,
                                date: element.date_2,
                                basePrice: element.price_2
                              });
                              flightsCrack.push({
                                code: element.code_3,
                                origin: element.origin_3,
                                destiny: element.destiny_3,
                                date: element.date_3,
                                basePrice: element.price_3
                              });
                              airport.flights.push(flightsCrack);
                            });
                            sequelize.query(`
                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                              FROM Flights AS a
                              JOIN Flights AS b 
                              JOIN Flights AS c
                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[2]} ) + 2 HOUR) 
                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[2]} ) + 2 HOUR) 
                              AND (a.routeId = ${array1[2]} ) AND (b.routeId = ${array2[2]} ) AND (c.routeId = ${array3[2]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[2]}) + 24 HOUR > b.date)
                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[2]}) + 24 HOUR > c.date)
                            `, { type: sequelize.QueryTypes.SELECT })
                              .then(result => {
                                result.forEach(element => {
                                  let flightsCrack = [];
                                  flightsCrack.push({
                                    code: element.code_1,
                                    origin: element.origin_1,
                                    destiny: element.destiny_1,
                                    date: element.date_1,
                                    basePrice: element.price_1
                                  });
                                  flightsCrack.push({
                                    code: element.code_2,
                                    origin: element.origin_2,
                                    destiny: element.destiny_2,
                                    date: element.date_2,
                                    basePrice: element.price_2
                                  });
                                  flightsCrack.push({
                                    code: element.code_3,
                                    origin: element.origin_3,
                                    destiny: element.destiny_3,
                                    date: element.date_3,
                                    basePrice: element.price_3
                                  });
                                  airport.flights.push(flightsCrack);
                                });
                                sequelize.query(`
                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                  FROM Flights AS a
                                  JOIN Flights AS b 
                                  JOIN Flights AS c
                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[3]} ) + 2 HOUR) 
                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[3]} ) + 2 HOUR) 
                                  AND (a.routeId = ${array1[3]} ) AND (b.routeId = ${array2[3]} ) AND (c.routeId = ${array3[3]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[3]}) + 24 HOUR > b.date)
                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[3]}) + 24 HOUR > c.date)
                                `, { type: sequelize.QueryTypes.SELECT })
                                  .then(result => {
                                    result.forEach(element => {
                                      let flightsCrack = [];
                                      flightsCrack.push({
                                        code: element.code_1,
                                        origin: element.origin_1,
                                        destiny: element.destiny_1,
                                        date: element.date_1,
                                        basePrice: element.price_1
                                      });
                                      flightsCrack.push({
                                        code: element.code_2,
                                        origin: element.origin_2,
                                        destiny: element.destiny_2,
                                        date: element.date_2,
                                        basePrice: element.price_2
                                      });
                                      flightsCrack.push({
                                        code: element.code_3,
                                        origin: element.origin_3,
                                        destiny: element.destiny_3,
                                        date: element.date_3,
                                        basePrice: element.price_3
                                      });
                                      airport.flights.push(flightsCrack);
                                    });
                                    sequelize.query(`
                                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                      FROM Flights AS a
                                      JOIN Flights AS b 
                                      JOIN Flights AS c
                                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[4]} ) + 2 HOUR) 
                                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[4]} ) + 2 HOUR) 
                                      AND (a.routeId = ${array1[4]} ) AND (b.routeId = ${array2[4]} ) AND (c.routeId = ${array3[4]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[4]}) + 24 HOUR > b.date)
                                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[4]}) + 24 HOUR > c.date)
                                    `, { type: sequelize.QueryTypes.SELECT })
                                      .then(result => {
                                        result.forEach(element => {
                                          let flightsCrack = [];
                                          flightsCrack.push({
                                            code: element.code_1,
                                            origin: element.origin_1,
                                            destiny: element.destiny_1,
                                            date: element.date_1,
                                            basePrice: element.price_1
                                          });
                                          flightsCrack.push({
                                            code: element.code_2,
                                            origin: element.origin_2,
                                            destiny: element.destiny_2,
                                            date: element.date_2,
                                            basePrice: element.price_2
                                          });
                                          flightsCrack.push({
                                            code: element.code_3,
                                            origin: element.origin_3,
                                            destiny: element.destiny_3,
                                            date: element.date_3,
                                            basePrice: element.price_3
                                          });
                                          airport.flights.push(flightsCrack);
                                        });
                                        sequelize.query(`
                                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                          FROM Flights AS a
                                          JOIN Flights AS b 
                                          JOIN Flights AS c
                                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[5]} ) + 2 HOUR) 
                                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[5]} ) + 2 HOUR) 
                                          AND (a.routeId = ${array1[5]} ) AND (b.routeId = ${array2[5]} ) AND (c.routeId = ${array3[5]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[5]}) + 24 HOUR > b.date)
                                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[5]}) + 24 HOUR > c.date)
                                        `, { type: sequelize.QueryTypes.SELECT })
                                          .then(result => {
                                            result.forEach(element => {
                                              let flightsCrack = [];
                                              flightsCrack.push({
                                                code: element.code_1,
                                                origin: element.origin_1,
                                                destiny: element.destiny_1,
                                                date: element.date_1,
                                                basePrice: element.price_1
                                              });
                                              flightsCrack.push({
                                                code: element.code_2,
                                                origin: element.origin_2,
                                                destiny: element.destiny_2,
                                                date: element.date_2,
                                                basePrice: element.price_2
                                              });
                                              flightsCrack.push({
                                                code: element.code_3,
                                                origin: element.origin_3,
                                                destiny: element.destiny_3,
                                                date: element.date_3,
                                                basePrice: element.price_3
                                              });
                                              airport.flights.push(flightsCrack);
                                            });
                                            sequelize.query(`
                                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                              FROM Flights AS a
                                              JOIN Flights AS b 
                                              JOIN Flights AS c
                                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[6]} ) + 2 HOUR) 
                                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[6]} ) + 2 HOUR) 
                                              AND (a.routeId = ${array1[6]} ) AND (b.routeId = ${array2[6]} ) AND (c.routeId = ${array3[6]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[6]}) + 24 HOUR > b.date)
                                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[6]}) + 24 HOUR > c.date)
                                            `, { type: sequelize.QueryTypes.SELECT })
                                              .then(result => {
                                                result.forEach(element => {
                                                  let flightsCrack = [];
                                                  flightsCrack.push({
                                                    code: element.code_1,
                                                    origin: element.origin_1,
                                                    destiny: element.destiny_1,
                                                    date: element.date_1,
                                                    basePrice: element.price_1
                                                  });
                                                  flightsCrack.push({
                                                    code: element.code_2,
                                                    origin: element.origin_2,
                                                    destiny: element.destiny_2,
                                                    date: element.date_2,
                                                    basePrice: element.price_2
                                                  });
                                                  flightsCrack.push({
                                                    code: element.code_3,
                                                    origin: element.origin_3,
                                                    destiny: element.destiny_3,
                                                    date: element.date_3,
                                                    basePrice: element.price_3
                                                  });
                                                  airport.flights.push(flightsCrack);
                                                });
                                                sequelize.query(`
                                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                  FROM Flights AS a
                                                  JOIN Flights AS b 
                                                  JOIN Flights AS c
                                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[7]} ) + 2 HOUR) 
                                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[7]} ) + 2 HOUR) 
                                                  AND (a.routeId = ${array1[7]} ) AND (b.routeId = ${array2[7]} ) AND (c.routeId = ${array3[7]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[7]}) + 24 HOUR > b.date)
                                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[7]}) + 24 HOUR > c.date)
                                                `, { type: sequelize.QueryTypes.SELECT })
                                                  .then(result => {
                                                    result.forEach(element => {
                                                      let flightsCrack = [];
                                                      flightsCrack.push({
                                                        code: element.code_1,
                                                        origin: element.origin_1,
                                                        destiny: element.destiny_1,
                                                        date: element.date_1,
                                                        basePrice: element.price_1
                                                      });
                                                      flightsCrack.push({
                                                        code: element.code_2,
                                                        origin: element.origin_2,
                                                        destiny: element.destiny_2,
                                                        date: element.date_2,
                                                        basePrice: element.price_2
                                                      });
                                                      flightsCrack.push({
                                                        code: element.code_3,
                                                        origin: element.origin_3,
                                                        destiny: element.destiny_3,
                                                        date: element.date_3,
                                                        basePrice: element.price_3
                                                      });
                                                      airport.flights.push(flightsCrack);
                                                    });
                                                    sequelize.query(`
                                                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                      FROM Flights AS a
                                                      JOIN Flights AS b 
                                                      JOIN Flights AS c
                                                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[8]} ) + 2 HOUR) 
                                                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[8]} ) + 2 HOUR) 
                                                      AND (a.routeId = ${array1[8]} ) AND (b.routeId = ${array2[8]} ) AND (c.routeId = ${array3[8]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[8]}) + 24 HOUR > b.date)
                                                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[8]}) + 24 HOUR > c.date)
                                                    `, { type: sequelize.QueryTypes.SELECT })
                                                      .then(result => {
                                                        result.forEach(element => {
                                                          let flightsCrack = [];
                                                          flightsCrack.push({
                                                            code: element.code_1,
                                                            origin: element.origin_1,
                                                            destiny: element.destiny_1,
                                                            date: element.date_1,
                                                            basePrice: element.price_1
                                                          });
                                                          flightsCrack.push({
                                                            code: element.code_2,
                                                            origin: element.origin_2,
                                                            destiny: element.destiny_2,
                                                            date: element.date_2,
                                                            basePrice: element.price_2
                                                          });
                                                          flightsCrack.push({
                                                            code: element.code_3,
                                                            origin: element.origin_3,
                                                            destiny: element.destiny_3,
                                                            date: element.date_3,
                                                            basePrice: element.price_3
                                                          });
                                                          airport.flights.push(flightsCrack);
                                                        });
                                                        sequelize.query(`
                                                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                          FROM Flights AS a
                                                          JOIN Flights AS b 
                                                          JOIN Flights AS c
                                                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[9]} ) + 2 HOUR) 
                                                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[9]} ) + 2 HOUR) 
                                                          AND (a.routeId = ${array1[9]} ) AND (b.routeId = ${array2[9]} ) AND (c.routeId = ${array3[9]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[9]}) + 24 HOUR > b.date)
                                                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[9]}) + 24 HOUR > c.date)
                                                        `, { type: sequelize.QueryTypes.SELECT })
                                                          .then(result => {
                                                            result.forEach(element => {
                                                              let flightsCrack = [];
                                                              flightsCrack.push({
                                                                code: element.code_1,
                                                                origin: element.origin_1,
                                                                destiny: element.destiny_1,
                                                                date: element.date_1,
                                                                basePrice: element.price_1
                                                              });
                                                              flightsCrack.push({
                                                                code: element.code_2,
                                                                origin: element.origin_2,
                                                                destiny: element.destiny_2,
                                                                date: element.date_2,
                                                                basePrice: element.price_2
                                                              });
                                                              flightsCrack.push({
                                                                code: element.code_3,
                                                                origin: element.origin_3,
                                                                destiny: element.destiny_3,
                                                                date: element.date_3,
                                                                basePrice: element.price_3
                                                              });
                                                              airport.flights.push(flightsCrack);
                                                            });
                                                            // res.json(airport);
                                                            // res.json({pene: 'pene'});
                                                            sequelize.query(`
                                                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                              FROM Flights AS a
                                                              JOIN Flights AS b 
                                                              JOIN Flights AS c
                                                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[10]} ) + 2 HOUR) 
                                                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[10]} ) + 2 HOUR) 
                                                              AND (a.routeId = ${array1[10]} ) AND (b.routeId = ${array2[10]} ) AND (c.routeId = ${array3[10]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[10]}) + 24 HOUR > b.date)
                                                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[10]}) + 24 HOUR > c.date)
                                                            `, { type: sequelize.QueryTypes.SELECT })
                                                              .then(result => {
                                                                result.forEach(element => {
                                                                  let flightsCrack = [];
                                                                  flightsCrack.push({
                                                                    code: element.code_1,
                                                                    origin: element.origin_1,
                                                                    destiny: element.destiny_1,
                                                                    date: element.date_1,
                                                                    basePrice: element.price_1
                                                                  });
                                                                  flightsCrack.push({
                                                                    code: element.code_2,
                                                                    origin: element.origin_2,
                                                                    destiny: element.destiny_2,
                                                                    date: element.date_2,
                                                                    basePrice: element.price_2
                                                                  });
                                                                  flightsCrack.push({
                                                                    code: element.code_3,
                                                                    origin: element.origin_3,
                                                                    destiny: element.destiny_3,
                                                                    date: element.date_3,
                                                                    basePrice: element.price_3
                                                                  });
                                                                  airport.flights.push(flightsCrack);
                                                                });
                                                                sequelize.query(`
                                                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                                  FROM Flights AS a
                                                                  JOIN Flights AS b 
                                                                  JOIN Flights AS c
                                                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[11]} ) + 2 HOUR) 
                                                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[11]} ) + 2 HOUR) 
                                                                  AND (a.routeId = ${array1[11]} ) AND (b.routeId = ${array2[11]} ) AND (c.routeId = ${array3[11]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[11]}) + 24 HOUR > b.date)
                                                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[11]}) + 24 HOUR > c.date)
                                                                `, { type: sequelize.QueryTypes.SELECT })
                                                                  .then(result => {
                                                                    result.forEach(element => {
                                                                      let flightsCrack = [];
                                                                      flightsCrack.push({
                                                                        code: element.code_1,
                                                                        origin: element.origin_1,
                                                                        destiny: element.destiny_1,
                                                                        date: element.date_1,
                                                                        basePrice: element.price_1
                                                                      });
                                                                      flightsCrack.push({
                                                                        code: element.code_2,
                                                                        origin: element.origin_2,
                                                                        destiny: element.destiny_2,
                                                                        date: element.date_2,
                                                                        basePrice: element.price_2
                                                                      });
                                                                      flightsCrack.push({
                                                                        code: element.code_3,
                                                                        origin: element.origin_3,
                                                                        destiny: element.destiny_3,
                                                                        date: element.date_3,
                                                                        basePrice: element.price_3
                                                                      });
                                                                      airport.flights.push(flightsCrack);
                                                                    });
                                                                    if (airport.flights.length === 0) {
                                                                      req.flash('info', 'Not found flights like that.');
                                                                      req.session.save(function () {
                                                                        res.redirect('/');
                                                                      });
                                                                    } else {
                                                                      res.render('airport', { title: 'airport', airport });
                                                                    }
                                                                  })
                                                                  .catch(err => console.log(err));
                                                              })
                                                              .catch(err => console.log(err));
                                                          })
                                                          .catch(err => console.log(err));
                                                      })
                                                      .catch(err => console.log(err));
                                                  })
                                                  .catch(err => console.log(err));
                                              })
                                              .catch(err => console.log(err));
                                          })
                                          .catch(err => console.log(err));
                                      })
                                      .catch(err => console.log(err));
                                  })
                                  .catch(err => console.log(err));
                              })
                              .catch(err => console.log(err));
                          })
                          .catch(err => console.log(err));
                      })
                      .catch(err => console.log(err));
                  })
                  .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));


  } else if (req.body.from && req.body.to && req.body.dateDepart && req.body.scales) { // From, To, Date, Scales

      sequelize.query(`
      SELECT city, lon, lat, name 
      FROM Airports
      WHERE IATACode = '${to}'
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        airport = {
          iata: to,
          city: result[0].city,
          lon: result[0].lon,
          lat: result[0].lat,
          name: result[0].name
        };
        airport.flights = [];
        // #######################################################################################################
        // ######################## PRIMER GENERADOR DE NUMEROS DE RUTAS PARA DOS ESCALAS ########################
        // #######################################################################################################
        sequelize.query(`
          SELECT a.id as ruta1, b.id as ruta2
          FROM Routes as a
          JOIN Routes as b
          WHERE (a.destiny = b.origin) AND (a.origin = '${from}') AND (b.destiny = '${to}')
        `, { type: sequelize.QueryTypes.SELECT })
          .then(result => {
            const ruta11 = result[0].ruta1;
            const ruta12 = result[0].ruta2;
              const ruta21 = result[1].ruta1;
              const ruta22 = result[1].ruta2;
                const ruta31 = result[2].ruta1;
                const ruta32 = result[2].ruta2;
                  const ruta41 = result[3].ruta1;
                  const ruta42 = result[3].ruta2;
            // VUELOS CON ESCALA (UTILIZAR NUMEROS DE RUTA GENERADOS POR EL QUERY GENERADOR DE RUTAS)
            sequelize.query(`
              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
              FROM Flights AS a
              JOIN Flights AS b 
              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta11}) + 2 HOUR) 
              AND (a.routeId = ${ruta11}) AND (b.routeId = ${ruta12}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta11}) + 24 HOUR > b.date)
              AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
            `, { type: sequelize.QueryTypes.SELECT })
              .then(result => {
                // AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });
                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta21}) + 2 HOUR) 
                AND (a.routeId = ${ruta21}) AND (b.routeId = ${ruta22}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta21}) + 24 HOUR > b.date)
                AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
              `, { type: sequelize.QueryTypes.SELECT })

              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });

                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta31}) + 2 HOUR) 
                AND (a.routeId = ${ruta31}) AND (b.routeId = ${ruta32}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta31}) + 24 HOUR > b.date)
                AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
              `, { type: sequelize.QueryTypes.SELECT })
              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });

                return sequelize.query(`
                SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2
                FROM Flights AS a
                JOIN Flights AS b 
                INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta41}) + 2 HOUR) 
                AND (a.routeId = ${ruta41}) AND (b.routeId = ${ruta42}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${ruta41}) + 24 HOUR > b.date)
                AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
              `, { type: sequelize.QueryTypes.SELECT })
              })
              .then(result => {
                result.forEach(element => {
                  let flightsCrack = [];
                  flightsCrack.push({
                    code: element.code_1,
                    origin: element.origin_1,
                    destiny: element.destiny_1,
                    date: element.date_1,
                    basePrice: element.price_1
                  });
                  flightsCrack.push({
                    code: element.code_2,
                    origin: element.origin_2,
                    destiny: element.destiny_2,
                    date: element.date_2,
                    basePrice: element.price_2
                  });
                  airport.flights.push(flightsCrack);
                });
                sequelize.query(`
                  SELECT a.id as ruta1, b.id as ruta2, c.id as ruta3
                  FROM Routes as a
                  JOIN Routes as b
                  JOIN Routes as c
                  WHERE (a.destiny = b.origin) AND (b.destiny = c.origin) AND (a.origin = '${from}') AND (c.destiny = '${to}') AND (a.origin != b.destiny) AND (c.destiny != b.origin)
                `, { type: sequelize.QueryTypes.SELECT })
                  .then(result => {
                    const ruta11 = result[0].ruta1;
                    const ruta12 = result[0].ruta2;
                    const ruta13 = result[0].ruta3;
                      const ruta21 = result[1].ruta1;
                      const ruta22 = result[1].ruta2;
                      const ruta23 = result[1].ruta3;
                        const ruta31 = result[2].ruta1;
                        const ruta32 = result[2].ruta2;
                        const ruta33 = result[2].ruta3;
                          const ruta41 = result[3].ruta1;
                          const ruta42 = result[3].ruta2;
                          const ruta43 = result[3].ruta3;
                            const ruta51 = result[4].ruta1;
                            const ruta52 = result[4].ruta2;
                            const ruta53 = result[4].ruta3;
                              const ruta61 = result[5].ruta1;
                              const ruta62 = result[5].ruta2;
                              const ruta63 = result[5].ruta3;
                                const ruta71 = result[6].ruta1;
                                const ruta72 = result[6].ruta2;
                                const ruta73 = result[6].ruta3;
                                  const ruta81 = result[7].ruta1;
                                  const ruta82 = result[7].ruta2;
                                  const ruta83 = result[7].ruta3;
                                    const ruta91 = result[8].ruta1;
                                    const ruta92 = result[8].ruta2;
                                    const ruta93 = result[8].ruta3;
                                      const ruta101 = result[9].ruta1;
                                      const ruta102 = result[9].ruta2;
                                      const ruta103 = result[9].ruta3;
                                        const ruta111 = result[10].ruta1;
                                        const ruta112 = result[10].ruta2;
                                        const ruta113 = result[10].ruta3;
                                          const ruta121 = result[11].ruta1;
                                          const ruta122 = result[11].ruta2;
                                          const ruta123 = result[11].ruta3;
                    const array1 = [ruta11, ruta21, ruta31, ruta41, ruta51, ruta61, ruta71, ruta81, ruta91, ruta101, ruta111, ruta121];
                    const array2 = [ruta12, ruta22, ruta32, ruta42, ruta52, ruta62, ruta72, ruta82, ruta92, ruta102, ruta112, ruta122];
                    const array3 = [ruta13, ruta23, ruta33, ruta43, ruta53, ruta63, ruta73, ruta83, ruta93, ruta103, ruta113, ruta123];
                    sequelize.query(`
                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                      FROM Flights AS a
                      JOIN Flights AS b 
                      JOIN Flights AS c
                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[0]} ) + 2 HOUR) 
                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[0]} ) + 2 HOUR) 
                      AND (a.routeId = ${array1[0]} ) AND (b.routeId = ${array2[0]} ) AND (c.routeId = ${array3[0]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[0]}) + 24 HOUR > b.date)
                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[0]}) + 24 HOUR > c.date)
                      AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                    `, { type: sequelize.QueryTypes.SELECT })
                      .then(result => {
                        result.forEach(element => {
                          let flightsCrack = [];
                          flightsCrack.push({
                            code: element.code_1,
                            origin: element.origin_1,
                            destiny: element.destiny_1,
                            date: element.date_1,
                            basePrice: element.price_1
                          });
                          flightsCrack.push({
                            code: element.code_2,
                            origin: element.origin_2,
                            destiny: element.destiny_2,
                            date: element.date_2,
                            basePrice: element.price_2
                          });
                          flightsCrack.push({
                            code: element.code_3,
                            origin: element.origin_3,
                            destiny: element.destiny_3,
                            date: element.date_3,
                            basePrice: element.price_3
                          });
                          airport.flights.push(flightsCrack);
                        });
                        sequelize.query(`
                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                          FROM Flights AS a
                          JOIN Flights AS b 
                          JOIN Flights AS c
                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[1]} ) + 2 HOUR) 
                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[1]} ) + 2 HOUR) 
                          AND (a.routeId = ${array1[1]} ) AND (b.routeId = ${array2[1]} ) AND (c.routeId = ${array3[1]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[1]}) + 24 HOUR > b.date)
                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[1]}) + 24 HOUR > c.date)
                          AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                        `, { type: sequelize.QueryTypes.SELECT })
                          .then(result => {
                            result.forEach(element => {
                              let flightsCrack = [];
                              flightsCrack.push({
                                code: element.code_1,
                                origin: element.origin_1,
                                destiny: element.destiny_1,
                                date: element.date_1,
                                basePrice: element.price_1
                              });
                              flightsCrack.push({
                                code: element.code_2,
                                origin: element.origin_2,
                                destiny: element.destiny_2,
                                date: element.date_2,
                                basePrice: element.price_2
                              });
                              flightsCrack.push({
                                code: element.code_3,
                                origin: element.origin_3,
                                destiny: element.destiny_3,
                                date: element.date_3,
                                basePrice: element.price_3
                              });
                              airport.flights.push(flightsCrack);
                            });
                            sequelize.query(`
                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                              FROM Flights AS a
                              JOIN Flights AS b 
                              JOIN Flights AS c
                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[2]} ) + 2 HOUR) 
                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[2]} ) + 2 HOUR) 
                              AND (a.routeId = ${array1[2]} ) AND (b.routeId = ${array2[2]} ) AND (c.routeId = ${array3[2]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[2]}) + 24 HOUR > b.date)
                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[2]}) + 24 HOUR > c.date)
                              AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                            `, { type: sequelize.QueryTypes.SELECT })
                              .then(result => {
                                result.forEach(element => {
                                  let flightsCrack = [];
                                  flightsCrack.push({
                                    code: element.code_1,
                                    origin: element.origin_1,
                                    destiny: element.destiny_1,
                                    date: element.date_1,
                                    basePrice: element.price_1
                                  });
                                  flightsCrack.push({
                                    code: element.code_2,
                                    origin: element.origin_2,
                                    destiny: element.destiny_2,
                                    date: element.date_2,
                                    basePrice: element.price_2
                                  });
                                  flightsCrack.push({
                                    code: element.code_3,
                                    origin: element.origin_3,
                                    destiny: element.destiny_3,
                                    date: element.date_3,
                                    basePrice: element.price_3
                                  });
                                  airport.flights.push(flightsCrack);
                                });
                                sequelize.query(`
                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                  FROM Flights AS a
                                  JOIN Flights AS b 
                                  JOIN Flights AS c
                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[3]} ) + 2 HOUR) 
                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[3]} ) + 2 HOUR) 
                                  AND (a.routeId = ${array1[3]} ) AND (b.routeId = ${array2[3]} ) AND (c.routeId = ${array3[3]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[3]}) + 24 HOUR > b.date)
                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[3]}) + 24 HOUR > c.date)
                                  AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                `, { type: sequelize.QueryTypes.SELECT })
                                  .then(result => {
                                    result.forEach(element => {
                                      let flightsCrack = [];
                                      flightsCrack.push({
                                        code: element.code_1,
                                        origin: element.origin_1,
                                        destiny: element.destiny_1,
                                        date: element.date_1,
                                        basePrice: element.price_1
                                      });
                                      flightsCrack.push({
                                        code: element.code_2,
                                        origin: element.origin_2,
                                        destiny: element.destiny_2,
                                        date: element.date_2,
                                        basePrice: element.price_2
                                      });
                                      flightsCrack.push({
                                        code: element.code_3,
                                        origin: element.origin_3,
                                        destiny: element.destiny_3,
                                        date: element.date_3,
                                        basePrice: element.price_3
                                      });
                                      airport.flights.push(flightsCrack);
                                    });
                                    sequelize.query(`
                                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                      FROM Flights AS a
                                      JOIN Flights AS b 
                                      JOIN Flights AS c
                                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[4]} ) + 2 HOUR) 
                                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[4]} ) + 2 HOUR) 
                                      AND (a.routeId = ${array1[4]} ) AND (b.routeId = ${array2[4]} ) AND (c.routeId = ${array3[4]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[4]}) + 24 HOUR > b.date)
                                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[4]}) + 24 HOUR > c.date)
                                      AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                    `, { type: sequelize.QueryTypes.SELECT })
                                      .then(result => {
                                        result.forEach(element => {
                                          let flightsCrack = [];
                                          flightsCrack.push({
                                            code: element.code_1,
                                            origin: element.origin_1,
                                            destiny: element.destiny_1,
                                            date: element.date_1,
                                            basePrice: element.price_1
                                          });
                                          flightsCrack.push({
                                            code: element.code_2,
                                            origin: element.origin_2,
                                            destiny: element.destiny_2,
                                            date: element.date_2,
                                            basePrice: element.price_2
                                          });
                                          flightsCrack.push({
                                            code: element.code_3,
                                            origin: element.origin_3,
                                            destiny: element.destiny_3,
                                            date: element.date_3,
                                            basePrice: element.price_3
                                          });
                                          airport.flights.push(flightsCrack);
                                        });
                                        sequelize.query(`
                                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                          FROM Flights AS a
                                          JOIN Flights AS b 
                                          JOIN Flights AS c
                                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[5]} ) + 2 HOUR) 
                                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[5]} ) + 2 HOUR) 
                                          AND (a.routeId = ${array1[5]} ) AND (b.routeId = ${array2[5]} ) AND (c.routeId = ${array3[5]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[5]}) + 24 HOUR > b.date)
                                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[5]}) + 24 HOUR > c.date)
                                          AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                        `, { type: sequelize.QueryTypes.SELECT })
                                          .then(result => {
                                            result.forEach(element => {
                                              let flightsCrack = [];
                                              flightsCrack.push({
                                                code: element.code_1,
                                                origin: element.origin_1,
                                                destiny: element.destiny_1,
                                                date: element.date_1,
                                                basePrice: element.price_1
                                              });
                                              flightsCrack.push({
                                                code: element.code_2,
                                                origin: element.origin_2,
                                                destiny: element.destiny_2,
                                                date: element.date_2,
                                                basePrice: element.price_2
                                              });
                                              flightsCrack.push({
                                                code: element.code_3,
                                                origin: element.origin_3,
                                                destiny: element.destiny_3,
                                                date: element.date_3,
                                                basePrice: element.price_3
                                              });
                                              airport.flights.push(flightsCrack);
                                            });
                                            sequelize.query(`
                                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                              FROM Flights AS a
                                              JOIN Flights AS b 
                                              JOIN Flights AS c
                                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[6]} ) + 2 HOUR) 
                                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[6]} ) + 2 HOUR) 
                                              AND (a.routeId = ${array1[6]} ) AND (b.routeId = ${array2[6]} ) AND (c.routeId = ${array3[6]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[6]}) + 24 HOUR > b.date)
                                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[6]}) + 24 HOUR > c.date)
                                              AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                            `, { type: sequelize.QueryTypes.SELECT })
                                              .then(result => {
                                                result.forEach(element => {
                                                  let flightsCrack = [];
                                                  flightsCrack.push({
                                                    code: element.code_1,
                                                    origin: element.origin_1,
                                                    destiny: element.destiny_1,
                                                    date: element.date_1,
                                                    basePrice: element.price_1
                                                  });
                                                  flightsCrack.push({
                                                    code: element.code_2,
                                                    origin: element.origin_2,
                                                    destiny: element.destiny_2,
                                                    date: element.date_2,
                                                    basePrice: element.price_2
                                                  });
                                                  flightsCrack.push({
                                                    code: element.code_3,
                                                    origin: element.origin_3,
                                                    destiny: element.destiny_3,
                                                    date: element.date_3,
                                                    basePrice: element.price_3
                                                  });
                                                  airport.flights.push(flightsCrack);
                                                });
                                                sequelize.query(`
                                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                  FROM Flights AS a
                                                  JOIN Flights AS b 
                                                  JOIN Flights AS c
                                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[7]} ) + 2 HOUR) 
                                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[7]} ) + 2 HOUR) 
                                                  AND (a.routeId = ${array1[7]} ) AND (b.routeId = ${array2[7]} ) AND (c.routeId = ${array3[7]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[7]}) + 24 HOUR > b.date)
                                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[7]}) + 24 HOUR > c.date)
                                                  AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                                `, { type: sequelize.QueryTypes.SELECT })
                                                  .then(result => {
                                                    result.forEach(element => {
                                                      let flightsCrack = [];
                                                      flightsCrack.push({
                                                        code: element.code_1,
                                                        origin: element.origin_1,
                                                        destiny: element.destiny_1,
                                                        date: element.date_1,
                                                        basePrice: element.price_1
                                                      });
                                                      flightsCrack.push({
                                                        code: element.code_2,
                                                        origin: element.origin_2,
                                                        destiny: element.destiny_2,
                                                        date: element.date_2,
                                                        basePrice: element.price_2
                                                      });
                                                      flightsCrack.push({
                                                        code: element.code_3,
                                                        origin: element.origin_3,
                                                        destiny: element.destiny_3,
                                                        date: element.date_3,
                                                        basePrice: element.price_3
                                                      });
                                                      airport.flights.push(flightsCrack);
                                                    });
                                                    sequelize.query(`
                                                      SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                      FROM Flights AS a
                                                      JOIN Flights AS b 
                                                      JOIN Flights AS c
                                                      INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                      INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                      INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                      WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[8]} ) + 2 HOUR) 
                                                      AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[8]} ) + 2 HOUR) 
                                                      AND (a.routeId = ${array1[8]} ) AND (b.routeId = ${array2[8]} ) AND (c.routeId = ${array3[8]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[8]}) + 24 HOUR > b.date)
                                                      AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[8]}) + 24 HOUR > c.date)
                                                      AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                                    `, { type: sequelize.QueryTypes.SELECT })
                                                      .then(result => {
                                                        result.forEach(element => {
                                                          let flightsCrack = [];
                                                          flightsCrack.push({
                                                            code: element.code_1,
                                                            origin: element.origin_1,
                                                            destiny: element.destiny_1,
                                                            date: element.date_1,
                                                            basePrice: element.price_1
                                                          });
                                                          flightsCrack.push({
                                                            code: element.code_2,
                                                            origin: element.origin_2,
                                                            destiny: element.destiny_2,
                                                            date: element.date_2,
                                                            basePrice: element.price_2
                                                          });
                                                          flightsCrack.push({
                                                            code: element.code_3,
                                                            origin: element.origin_3,
                                                            destiny: element.destiny_3,
                                                            date: element.date_3,
                                                            basePrice: element.price_3
                                                          });
                                                          airport.flights.push(flightsCrack);
                                                        });
                                                        sequelize.query(`
                                                          SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                          FROM Flights AS a
                                                          JOIN Flights AS b 
                                                          JOIN Flights AS c
                                                          INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                          INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                          INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                          WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[9]} ) + 2 HOUR) 
                                                          AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[9]} ) + 2 HOUR) 
                                                          AND (a.routeId = ${array1[9]} ) AND (b.routeId = ${array2[9]} ) AND (c.routeId = ${array3[9]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[9]}) + 24 HOUR > b.date)
                                                          AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[9]}) + 24 HOUR > c.date)
                                                          AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                                        `, { type: sequelize.QueryTypes.SELECT })
                                                          .then(result => {
                                                            result.forEach(element => {
                                                              let flightsCrack = [];
                                                              flightsCrack.push({
                                                                code: element.code_1,
                                                                origin: element.origin_1,
                                                                destiny: element.destiny_1,
                                                                date: element.date_1,
                                                                basePrice: element.price_1
                                                              });
                                                              flightsCrack.push({
                                                                code: element.code_2,
                                                                origin: element.origin_2,
                                                                destiny: element.destiny_2,
                                                                date: element.date_2,
                                                                basePrice: element.price_2
                                                              });
                                                              flightsCrack.push({
                                                                code: element.code_3,
                                                                origin: element.origin_3,
                                                                destiny: element.destiny_3,
                                                                date: element.date_3,
                                                                basePrice: element.price_3
                                                              });
                                                              airport.flights.push(flightsCrack);
                                                            });
                                                            // res.json(airport);
                                                            // res.json({pene: 'pene'});
                                                            sequelize.query(`
                                                              SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                              FROM Flights AS a
                                                              JOIN Flights AS b 
                                                              JOIN Flights AS c
                                                              INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                              INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                              INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                              WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[10]} ) + 2 HOUR) 
                                                              AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[10]} ) + 2 HOUR) 
                                                              AND (a.routeId = ${array1[10]} ) AND (b.routeId = ${array2[10]} ) AND (c.routeId = ${array3[10]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[10]}) + 24 HOUR > b.date)
                                                              AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[10]}) + 24 HOUR > c.date)
                                                              AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                                            `, { type: sequelize.QueryTypes.SELECT })
                                                              .then(result => {
                                                                result.forEach(element => {
                                                                  let flightsCrack = [];
                                                                  flightsCrack.push({
                                                                    code: element.code_1,
                                                                    origin: element.origin_1,
                                                                    destiny: element.destiny_1,
                                                                    date: element.date_1,
                                                                    basePrice: element.price_1
                                                                  });
                                                                  flightsCrack.push({
                                                                    code: element.code_2,
                                                                    origin: element.origin_2,
                                                                    destiny: element.destiny_2,
                                                                    date: element.date_2,
                                                                    basePrice: element.price_2
                                                                  });
                                                                  flightsCrack.push({
                                                                    code: element.code_3,
                                                                    origin: element.origin_3,
                                                                    destiny: element.destiny_3,
                                                                    date: element.date_3,
                                                                    basePrice: element.price_3
                                                                  });
                                                                  airport.flights.push(flightsCrack);
                                                                });
                                                                sequelize.query(`
                                                                  SELECT a.code as code_1, tableroutes.origin as origin_1, tableroutes.destiny as destiny_1, a.date as date_1, tableroutes.basePrice as price_1, b.code as code_2, tableroutes2.origin as origin_2, tableroutes2.destiny as destiny_2, b.date as date_2, tableroutes2.basePrice as price_2, c.code as code_3, tableroutes3.origin as origin_3, tableroutes3.destiny as destiny_3, c.date as date_3, tableroutes3.basePrice as price_3
                                                                  FROM Flights AS a
                                                                  JOIN Flights AS b 
                                                                  JOIN Flights AS c
                                                                  INNER JOIN Routes AS tableroutes ON tableroutes.id = a.routeId 
                                                                  INNER JOIN Routes AS tableroutes2 ON tableroutes2.id = b.routeId 
                                                                  INNER JOIN Routes AS tableroutes3 ON tableroutes3.id = c.routeId
                                                                  WHERE (b.date > a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[11]} ) + 2 HOUR) 
                                                                  AND (c.date > b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[11]} ) + 2 HOUR) 
                                                                  AND (a.routeId = ${array1[11]} ) AND (b.routeId = ${array2[11]} ) AND (c.routeId = ${array3[11]}) AND (a.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array1[11]}) + 24 HOUR > b.date)
                                                                  AND (b.date + INTERVAL (SELECT travelTime FROM Routes WHERE id = ${array2[11]}) + 24 HOUR > c.date)
                                                                  AND a.date >= '${newdate} 00:00:00' AND a.date <= '${newdate} 23:59:59'
                                                                `, { type: sequelize.QueryTypes.SELECT })
                                                                  .then(result => {
                                                                    result.forEach(element => {
                                                                      let flightsCrack = [];
                                                                      flightsCrack.push({
                                                                        code: element.code_1,
                                                                        origin: element.origin_1,
                                                                        destiny: element.destiny_1,
                                                                        date: element.date_1,
                                                                        basePrice: element.price_1
                                                                      });
                                                                      flightsCrack.push({
                                                                        code: element.code_2,
                                                                        origin: element.origin_2,
                                                                        destiny: element.destiny_2,
                                                                        date: element.date_2,
                                                                        basePrice: element.price_2
                                                                      });
                                                                      flightsCrack.push({
                                                                        code: element.code_3,
                                                                        origin: element.origin_3,
                                                                        destiny: element.destiny_3,
                                                                        date: element.date_3,
                                                                        basePrice: element.price_3
                                                                      });
                                                                      airport.flights.push(flightsCrack);
                                                                    });
                                                                    if (airport.flights.length === 0) {
                                                                      req.flash('info', 'Not found flights like that.');
                                                                      req.session.save(function () {
                                                                        res.redirect('/');
                                                                      });
                                                                    } else {
                                                                      res.render('airport', { title: 'airport', airport });
                                                                    }
                                                                  })
                                                                  .catch(err => console.log(err));
                                                              })
                                                              .catch(err => console.log(err));
                                                          })
                                                          .catch(err => console.log(err));
                                                      })
                                                      .catch(err => console.log(err));
                                                  })
                                                  .catch(err => console.log(err));
                                              })
                                              .catch(err => console.log(err));
                                          })
                                          .catch(err => console.log(err));
                                      })
                                      .catch(err => console.log(err));
                                  })
                                  .catch(err => console.log(err));
                              })
                              .catch(err => console.log(err));
                          })
                          .catch(err => console.log(err));
                      })
                      .catch(err => console.log(err));
                  })
                  .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
};

exports.purchaseFlightTicket = (req, res) => {
  const identityCardB = req.body.identityCardBuyer; const firstNameB = req.body.firstNameBuyer; const lastNameB = req.body.lastNameBuyer; const ageB = req.body.ageBuyer; const emailB = req.body.emailBuyer; const nationalityB = req.body.nationalityBuyer; const genderB = req.body.genderBuyer;
  let identityCardP = ''; let firstNameP = ''; let lastNameP = ''; let ageP = ''; let emailP = ''; let nationalityP = ''; let genderP = '';
  if (req.body.identityCardPassenger) {
    identityCardP = req.body.identityCardPassenger; firstNamedP = req.body.firstNamePassenger; lastNameP = req.body.lastNamePassenger; ageP = req.body.agePassenger; emailP = req.body.emailPassenger; nationalityP = req.body.nationalityPassenger; genderP = req.body.genderPassenger;
  }
  const cantScales = req.body.cantScales;
  // res.json(req.body);

  if (cantScales == 1) { // Vuelo sin escalas
    let idB = ''; 
    let idP = '';

    if (identityCardP !== '') { // Si hay pasajero distinto al comprador
      sequelize.query(`
        SELECT id
        FROM Customers
        WHERE identityCard = ${identityCardB}
      `, { type: sequelize.QueryTypes.SELECT })
        .then(result => {
          idB = result[0].id;
          
          return sequelize.query(`
            SELECT id
            FROM Customers
            WHERE identityCard = ${identityCardP}
          `, { type: sequelize.QueryTypes.SELECT });
        })
        .then(result => {
          idP = result[0].id;

          FlightTicket.create({
            buyerId: idB,
            passengerId: idP,
            salePrice: req.body.salePrice
          })
          .then(result => {
            let type = '';
            if (req.body.seatScale == 1 || req.body.seatScale == 2 || req.body.seatScale == 3 || req.body.seatScale == 4 || req.body.seatScale == 5 || req.body.seatScale == 6 || req.body.seatScale == 7 || req.body.seatScale == 8) {
              type = 'Business';
            } else {
              type = 'Economic';
            }

            FlightTicket_Flights.create({
              flightTicketId: result.id,
              flightCode: req.body.flightCode,
              type: type,
              seatNumber: req.body.seatScale,
              cantPacking: req.body.packingScale
            })
            .then(result => {
              req.flash('success', 'Ticket successfully purchased!');
              req.session.save(function () {
                res.redirect('/');
              });
              return null;
            })
            .catch(err => console.log(err));
            return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));

    } else { // Si el pasajero es igual al comprador
      sequelize.query(`
        SELECT id
        FROM Customers
        WHERE identityCard = ${identityCardB}
      `, { type: sequelize.QueryTypes.SELECT })
        .then(result => {
          idB = result[0].id;
          idP = result[0].id;

          FlightTicket.create({
            buyerId: idB,
            passengerId: idP,
            salePrice: req.body.salePrice
          })
          .then(result => {
            let type = '';
            if (req.body.seatScale == 1 || req.body.seatScale == 2 || req.body.seatScale == 3 || req.body.seatScale == 4 || req.body.seatScale == 5 || req.body.seatScale == 6 || req.body.seatScale == 7 || req.body.seatScale == 8) {
              type = 'Business';
            } else {
              type = 'Economic';
            }

            FlightTicket_Flights.create({
              flightTicketId: result.id,
              flightCode: req.body.flightCode,
              type: type,
              seatNumber: req.body.seatScale,
              cantPacking: req.body.packingScale
            })
            .then(result => {
              req.flash('success', 'Ticket successfully purchased!');
              req.session.save(function () {
                res.redirect('/');
              });

              return null;
            })
            .catch(err => console.log(err));
            return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));

    }
  } else if (cantScales == 2) { // Vuelo con 1 escala
    let idB = ''; 
    let idP = '';

    if (identityCardP !== '') { // Si hay pasajero distinto al comprador
      sequelize.query(`
        SELECT id
        FROM Customers
        WHERE identityCard = ${identityCardB}
      `, { type: sequelize.QueryTypes.SELECT })
        .then(result => {
          idB = result[0].id;
          
          return sequelize.query(`
            SELECT id
            FROM Customers
            WHERE identityCard = ${identityCardP}
          `, { type: sequelize.QueryTypes.SELECT });
        })
        .then(result => {
          idP = result[0].id;

          FlightTicket.create({
            buyerId: idB,
            passengerId: idP,
            salePrice: req.body.salePrice[0]
          })
          .then(result => {
            let type = '';
            if (req.body.seatScale[0] == 1 || req.body.seatScale[0] == 2 || req.body.seatScale[0] == 3 || req.body.seatScale[0] == 4 || req.body.seatScale[0] == 5 || req.body.seatScale[0] == 6 || req.body.seatScale[0] == 7 || req.body.seatScale[0] == 8) {
              type = 'Business';
            } else {
              type = 'Economic';
            }

            FlightTicket_Flights.create({
              flightTicketId: result.id,
              flightCode: req.body.flightCodeOne,
              type: type,
              seatNumber: req.body.seatScale[0],
              cantPacking: req.body.packingScale[0]
            })
            .then(result => {
              
              FlightTicket.create({
                buyerId: idB,
                passengerId: idP,
                salePrice: req.body.salePrice[1]
              })
                .then(result => {
                  let type = '';
                  if (req.body.seatScale[1] == 1 || req.body.seatScale[1] == 2 || req.body.seatScale[1] == 3 || req.body.seatScale[1] == 4 || req.body.seatScale[1] == 5 || req.body.seatScale[1] == 6 || req.body.seatScale[1] == 7 || req.body.seatScale[1] == 8) {
                    type = 'Business';
                  } else {
                    type = 'Economic';
                  }

                  FlightTicket_Flights.create({
                    flightTicketId: result.id,
                    flightCode: req.body.flightCodeTwo,
                    type: type,
                    seatNumber: req.body.seatScale[1],
                    cantPacking: req.body.packingScale[1]
                  })
                    .then(result => {
                      req.flash('success', 'Ticket successfully purchased!');
                      req.session.save(function () {
                        res.redirect('/');
                      });

                      return null;
                    })
                  return null;
                })
                return null;
            })
            .catch(err => console.log(err));
            return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));

    } else { // Si el pasajero es igual al comprador

      sequelize.query(`
        SELECT id
        FROM Customers
        WHERE identityCard = ${identityCardB}
      `, { type: sequelize.QueryTypes.SELECT })
        .then(result => {
          idB = result[0].id;
          idP = result[0].id;

          FlightTicket.create({
            buyerId: idB,
            passengerId: idP,
            salePrice: req.body.salePrice[0]
          })
          .then(result => {
            let type = '';
            if (req.body.seatScale[0] == 1 || req.body.seatScale[0] == 2 || req.body.seatScale[0] == 3 || req.body.seatScale[0] == 4 || req.body.seatScale[0] == 5 || req.body.seatScale[0] == 6 || req.body.seatScale[0] == 7 || req.body.seatScale[0] == 8) {
              type = 'Business';
            } else {
              type = 'Economic';
            }

            FlightTicket_Flights.create({
              flightTicketId: result.id,
              flightCode: req.body.flightCodeOne,
              type: type,
              seatNumber: req.body.seatScale[0],
              cantPacking: req.body.packingScale[0]
            })
            .then(result => {
              
              FlightTicket.create({
                buyerId: idB,
                passengerId: idP,
                salePrice: req.body.salePrice[1]
              })
                .then(result => {
                  let type = '';
                  if (req.body.seatScale[1] == 1 || req.body.seatScale[1] == 2 || req.body.seatScale[1] == 3 || req.body.seatScale[1] == 4 || req.body.seatScale[1] == 5 || req.body.seatScale[1] == 6 || req.body.seatScale[1] == 7 || req.body.seatScale[1] == 8) {
                    type = 'Business';
                  } else {
                    type = 'Economic';
                  }

                  FlightTicket_Flights.create({
                    flightTicketId: result.id,
                    flightCode: req.body.flightCodeTwo,
                    type: type,
                    seatNumber: req.body.seatScale[1],
                    cantPacking: req.body.packingScale[1]
                  })
                    .then(result => {
                      req.flash('success', 'Ticket successfully purchased!');
                      req.session.save(function () {
                        res.redirect('/');
                      });

                      return null;
                    })
                  return null;
                })
                return null;
            })
            .catch(err => console.log(err));
            return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));

    }
  } else if (cantScales == 3) { // Vuelo con 2 escalas
    let idB = ''; 
    let idP = '';

    if (identityCardP !== '') { // Si hay pasajero distinto al comprador
      sequelize.query(`
        SELECT id
        FROM Customers
        WHERE identityCard = ${identityCardB}
      `, { type: sequelize.QueryTypes.SELECT })
        .then(result => {
          idB = result[0].id;
          
          return sequelize.query(`
            SELECT id
            FROM Customers
            WHERE identityCard = ${identityCardP}
          `, { type: sequelize.QueryTypes.SELECT });
        })
        .then(result => {
          idP = result[0].id;

          FlightTicket.create({
            buyerId: idB,
            passengerId: idP,
            salePrice: req.body.salePrice[0]
          })
          .then(result => {
            let type = '';
            if (req.body.seatScale[0] == 1 || req.body.seatScale[0] == 2 || req.body.seatScale[0] == 3 || req.body.seatScale[0] == 4 || req.body.seatScale[0] == 5 || req.body.seatScale[0] == 6 || req.body.seatScale[0] == 7 || req.body.seatScale[0] == 8) {
              type = 'Business';
            } else {
              type = 'Economic';
            }

            FlightTicket_Flights.create({
              flightTicketId: result.id,
              flightCode: req.body.flightCodeOne,
              type: type,
              seatNumber: req.body.seatScale[0],
              cantPacking: req.body.packingScale[0]
            })
            .then(result => {
              
              FlightTicket.create({
                buyerId: idB,
                passengerId: idP,
                salePrice: req.body.salePrice[1]
              })
                .then(result => {
                  let type = '';
                  if (req.body.seatScale[1] == 1 || req.body.seatScale[1] == 2 || req.body.seatScale[1] == 3 || req.body.seatScale[1] == 4 || req.body.seatScale[1] == 5 || req.body.seatScale[1] == 6 || req.body.seatScale[1] == 7 || req.body.seatScale[1] == 8) {
                    type = 'Business';
                  } else {
                    type = 'Economic';
                  }

                  FlightTicket_Flights.create({
                    flightTicketId: result.id,
                    flightCode: req.body.flightCodeTwo,
                    type: type,
                    seatNumber: req.body.seatScale[1],
                    cantPacking: req.body.packingScale[1]
                  })
                    .then(result => {
                      
                      FlightTicket.create({
                        buyerId: idB,
                        passengerId: idP,
                        salePrice: req.body.salePrice[2]
                      })
                      .then(result => {
                        let type = '';
                        if (req.body.seatScale[2] == 1 || req.body.seatScale[2] == 2 || req.body.seatScale[2] == 3 || req.body.seatScale[2] == 4 || req.body.seatScale[2] == 5 || req.body.seatScale[2] == 6 || req.body.seatScale[2] == 7 || req.body.seatScale[2] == 8) {
                          type = 'Business';
                        } else {
                          type = 'Economic';
                        }

                        FlightTicket_Flights.create({
                          flightTicketId: result.id,
                          flightCode: req.body.flightCodeThree,
                          type: type,
                          seatNumber: req.body.seatScale[2],
                          cantPacking: req.body.packingScale[2]
                        })
                        .then(result => {
                          req.flash('success', 'Ticket successfully purchased!');
                          req.session.save(function () {
                            res.redirect('/');
                          });
    
                          return null;
                        })
                        .catch(err => console.log(err));
                        return null;
                      })
                      .catch(err => console.log(err));
                    })
                  return null;
                })
                return null;
            })
            .catch(err => console.log(err));
            return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));

    } else { // Si el pasajero es igual al comprador

      sequelize.query(`
      SELECT id
      FROM Customers
      WHERE identityCard = ${identityCardB}
    `, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        idB = result[0].id;
        idP = result[0].id;

        FlightTicket.create({
          buyerId: idB,
          passengerId: idP,
          salePrice: req.body.salePrice[0]
        })
        .then(result => {
          let type = '';
          if (req.body.seatScale[0] == 1 || req.body.seatScale[0] == 2 || req.body.seatScale[0] == 3 || req.body.seatScale[0] == 4 || req.body.seatScale[0] == 5 || req.body.seatScale[0] == 6 || req.body.seatScale[0] == 7 || req.body.seatScale[0] == 8) {
            type = 'Business';
          } else {
            type = 'Economic';
          }

          FlightTicket_Flights.create({
            flightTicketId: result.id,
            flightCode: req.body.flightCodeOne,
            type: type,
            seatNumber: req.body.seatScale[0],
            cantPacking: req.body.packingScale[0]
          })
          .then(result => {
            
            FlightTicket.create({
              buyerId: idB,
              passengerId: idP,
              salePrice: req.body.salePrice[1]
            })
              .then(result => {
                let type = '';
                if (req.body.seatScale[1] == 1 || req.body.seatScale[1] == 2 || req.body.seatScale[1] == 3 || req.body.seatScale[1] == 4 || req.body.seatScale[1] == 5 || req.body.seatScale[1] == 6 || req.body.seatScale[1] == 7 || req.body.seatScale[1] == 8) {
                  type = 'Business';
                } else {
                  type = 'Economic';
                }

                FlightTicket_Flights.create({
                  flightTicketId: result.id,
                  flightCode: req.body.flightCodeTwo,
                  type: type,
                  seatNumber: req.body.seatScale[1],
                  cantPacking: req.body.packingScale[1]
                })
                  .then(result => {
                    
                    FlightTicket.create({
                      buyerId: idB,
                      passengerId: idP,
                      salePrice: req.body.salePrice[2]
                    })
                    .then(result => {
                      let type = '';
                      if (req.body.seatScale[2] == 1 || req.body.seatScale[2] == 2 || req.body.seatScale[2] == 3 || req.body.seatScale[2] == 4 || req.body.seatScale[2] == 5 || req.body.seatScale[2] == 6 || req.body.seatScale[2] == 7 || req.body.seatScale[2] == 8) {
                        type = 'Business';
                      } else {
                        type = 'Economic';
                      }

                      FlightTicket_Flights.create({
                        flightTicketId: result.id,
                        flightCode: req.body.flightCodeThree,
                        type: type,
                        seatNumber: req.body.seatScale[2],
                        cantPacking: req.body.packingScale[2]
                      })
                      .then(result => {
                        req.flash('success', 'Ticket successfully purchased!');
                        req.session.save(function () {
                          res.redirect('/');
                        });
  
                        return null;
                      })
                      .catch(err => console.log(err));
                      return null;
                    })
                    .catch(err => console.log(err));
                  })
                return null;
              })
              return null;
          })
          .catch(err => console.log(err));
          return null;
        })
        .catch(err => console.log(err));
        return null;
      })
      .catch(err => console.log(err));
    }
  }
};

exports.saveCustomer = (req, res, next) => {
  const identityCardB = req.body.identityCardBuyer; const firstNameB = req.body.firstNameBuyer; const lastNameB = req.body.lastNameBuyer; const ageB = req.body.ageBuyer; const emailB = req.body.emailBuyer; const nationalityB = req.body.nationalityBuyer; const genderB = req.body.genderBuyer;
  let identityCardP = ''; let firstNameP = ''; let lastNameP = ''; let ageP = ''; let emailP = ''; let nationalityP = ''; let genderP = '';
  if (req.body.identityCardPassenger) {
    identityCardP = req.body.identityCardPassenger; firstNamedP = req.body.firstNamePassenger; lastNameP = req.body.lastNamePassenger; ageP = req.body.agePassenger; emailP = req.body.emailPassenger; nationalityP = req.body.nationalityPassenger; genderP = req.body.genderPassenger;
  }

  // Verificamos si existe el Customer en la BDD
  sequelize.query(`
    SELECT identityCard
    FROM Customers
    WHERE identityCard = ${identityCardB}
  `, { type: sequelize.QueryTypes.SELECT })
    .then(result => {
      if (result.length === 0) { // Si no existe ese Customer
        Customer.create({
          identityCard: identityCardB,
          firstName: firstNameB,
          lastName: lastNameB,
          email: emailB,
          age: ageB,
          gender: genderB,
          nationality: nationalityB
        })
          .then(result => {
            console.log('BUYERRRRRRRRRR ', result)
            if (identityCardP !== '') { // Si el Passenger es distinto al Buyer
              // Verificamos si existe el Customer en la BDD
              sequelize.query(`
                SELECT identityCard
                FROM Customers
                WHERE identityCard = ${identityCardP}
              `, { type: sequelize.QueryTypes.SELECT })
                .then(result => {
                  if (result.length === 0) { // Si no existe ese Customer
                    Customer.create({
                      identityCard: identityCardP,
                      firstName: firstNameP,
                      lastName: lastNameP,
                      email: emailP,
                      age: ageP,
                      gender: genderP,
                      nationality: nationalityP
                    })
                      .then(result => {
                        console.log('PASSENGERRRRRR ', result);
                        next();
                      })
                        .catch(err => console.log(err));
                }
              })
              .catch(err => console.log(err));
            }
            return null;
          })
            .catch(err => console.log(err));
      } else {
        next();
      }
    })
    .catch(err => console.log(err));
};