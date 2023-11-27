var assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');

let export_data = require('./database.js');
let should = chai.should();
chai.use(chaiHttp);

describe('Date', function () {
  it('checking the correct date format translation', function () {
    assert.equal(export_data.formatDate(new Date("11.12.23")), "2023-11-12");
  });
});

describe('/GET', function () {
  it('CarsFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getCarsFromDB')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
  });
  it('CarNamesFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getCarNamesFromDB')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
  });
  it('CarPricesFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getCarPricesFromDB')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
  });
  it('EmployeesFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getEmployeesFromDB')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
  });
  it('ClientsFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getClientsFromDB')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
  });
  it('SumOfAllOrdersFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getSumOfAllOrdersFromDB')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
  });
  it('ClientStatisticsFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getClientStatisticsFromDB')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
  });
  it('CarsStatisticsFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getCarsStatisticsFromDB')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
  });
  it('EmployeeStatisticsFromDB', (done) => {
    chai.request(export_data.app)
            .get('/getEmployeeStatisticsFromDB')
            .end((err, res) => {
                res.should.have.status(200);
              done();
            });
  });
});

describe('/POST', function () {
  it('writeOrderToDB', (done) => {
    let carIDs_Equipments = new Map();
    carIDs_Equipments.set("1", "Повна (стандарт)"); 
    let order = {
      "fullNameEmployee": "Мельник Іван Маркович",
      "carIDs": "1",
      "carIDs_Equipments": JSON.stringify(Object.fromEntries(carIDs_Equipments)),
      "name": "Олексій",
      "surname": "Кондус",
      "patronymic": "Сергійович",
      "passportID": "12345",
      "phoneNumber": "380669358243",
      "transactionAmount": "30000000",
    }
    chai.request(export_data.app)
        .post('/writeOrderToDB')
        .send(order)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Order successfully added!');
          done();
        });
  });
  it('SumOfAllOrdersForThePeriodFromDB', (done) => {
    let dates = {
      "startDate": "2023-11-01",
      "endDate": "2023-11-30",
    }
    chai.request(export_data.app)
        .post('/getSumOfAllOrdersForThePeriodFromDB')
        .send(dates)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

          done();
        });
  });
  it('ClientStatisticsForThePeriodFromDB', (done) => {
    let dates = {
      "startDate": "2023-11-01",
      "endDate": "2023-11-30",
    }
    chai.request(export_data.app)
        .post('/getClientStatisticsForThePeriodFromDB')
        .send(dates)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');

          done();
        });
  });
  it('CarsStatisticsForThePeriodFromDB', (done) => {
    let dates = {
      "startDate": "2023-11-01",
      "endDate": "2023-11-30",
    }
    chai.request(export_data.app)
        .post('/getCarsStatisticsForThePeriodFromDB')
        .send(dates)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');

          done();
        });
  });
  it('EmployeeStatisticsForThePeriodFromDB', (done) => {
    let dates = {
      "startDate": "2023-11-01",
      "endDate": "2023-11-30",
    }
    chai.request(export_data.app)
        .post('/getEmployeeStatisticsForThePeriodFromDB')
        .send(dates)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');

          done();
        });
  });
});