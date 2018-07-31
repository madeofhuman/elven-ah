import { } from 'dotenv/config';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();
chai.use(chaiHttp);

const user = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johnny',
  email: 'johnny4life@yandex.com',
  password: 'Qwertyui0p',
  confirmPassword: 'Qwertyui0p',
};

describe('User signup', () => {
  let validEvc = '';
  it('should create the user and send verification email', (done) => {
    chai.request(app).post('/api/auth/signup').send(user).end((err, res) => {
      res.status.should.eql(201);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('message').eql('User signup successful and verification email sent.');
      done();
    });
  });

  it('should re-send the verification email when requested by the user', (done) => {
    chai.request(app).post('/api/auth/verify').send({ email: user.email }).end((err, res) => {
      res.status.should.eql(201);
      res.body.should.be.an('object').with.property('message').include('Email verification link re-sent successfully');
      res.body.should.have.property('url');
      validEvc = res.body.token;
      done();
    });
  });

  it('should activate the user if inactivated, and valid token supplied', (done) => {
    chai.request(app).get(`/api/auth/verify?evc=${validEvc}`).end((err, res) => {
      res.status.should.eql(200);
      res.body.should.be.an('object').with.property('message').include('Account successfully verified.');
      res.body.should.have.property('token');
      done();
    });
  });

  it('should return 400 when a user does not provide a firstName', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      lastName: 'Yomi',
      username: 'oyomi',
      email: 'johndoe@gmail.com',
      password: '8pcutTway',
      confirmPassword: '8pcutTway',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('firstName').include('The firstName field is required.');
      done();
    });
  });

  it('should return 400 when a user does not provide a lastName', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'Doe',
      username: 'Johnny',
      email: 'johndoe@gmail.com',
      password: 'Opcut2way',
      confirmPassword: 'Opcut2way',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('lastName').include('The lastName field is required.');
      done();
    });
  });

  it('should return 400 when a user does not provide an email', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'Johnny',
      password: 'Opcut2way',
      confirmPassword: 'Opcut2way',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('email').include('The email field is required.');
      done();
    });
  });

  it('should return 400 when a user does not provide a username', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'Opcut2way',
      confirmPassword: 'Opcut2way',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('username').include('The username field is required.');
      done();
    });
  });

  it('should return 400 when a user does not provide a password', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'Johnny',
      confirmPassword: 'Opcut2way',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('password').include('The password field is required.');
      done();
    });
  });

  it('should return 400 when a user provides a password that is not up to 8 characters', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'Johnny',
      password: 'Opcut',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('password').include('The password must be at least 8 characters.');
      done();
    });
  });

  it('should return 400 when a user provides a password that does not contain an upper/lower case letter or number', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'Johnny',
      password: 'Opcutuyh',
      confirmPassword: 'Opcutuyh',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('password').include('Password must contain an Upper case letter, a lower case letter and a number.');
      done();
    });
  });

  it('should return 400 when a user does not provide a confirmPassword', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'Johhny',
      password: 'Opcut2way',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('confirmPassword').include('The confirmPassword field is required.');
      done();
    });
  });

  it('should return 400 when a user provides a confirmPassword that is not equl to the password', (done) => {
    chai.request(app).post('/api/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'Johhny',
      password: 'Opcut2way',
      confirmPassword: 'Opcut2wau',
    }).end((req, res) => {
      res.status.should.eql(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('confirmPassword').include('The confirmPassword and password fields must match.');
      done();
    });
  });

  it('should return 409 when a user with the email already exists', (done) => {
    chai.request(app).post('/api/auth/signup').send(user).end((req, res) => {
      res.status.should.eql(409);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('email').include('User with email: johnny4life@yandex.com already exists.');
      done();
    });
  });

  it('should return 409 when a user with the username already exists', (done) => {
    chai.request(app).post('/api/auth/signup').send(user).end((req, res) => {
      res.status.should.eql(409);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('username').include('User with username: johnny already exists.');
      done();
    });
  });

  it('should return 409 when a user with the username and email already exists', (done) => {
    chai.request(app).post('/api/auth/signup').send(user).end((req, res) => {
      res.status.should.eql(409);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.errors.should.have.property('username').include('User with username: johnny already exists.');
      res.body.errors.should.have.property('email').include('User with email: johnny4life@yandex.com already exists.');
      done();
    });
  });
});
