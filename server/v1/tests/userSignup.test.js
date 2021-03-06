import { } from 'dotenv/config';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';
import JwtHelper from '../helpers/JwtHelper';
import AuthController, {} from '../controllers/AuthController';

chai.should();
chai.use(chaiHttp);

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'testuser@test.com',
  password: 'Qwertyui0p',
  confirmPassword: 'Qwertyui0p',
};
const userWithAlreadyUsedEmail = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'testuser@test.com',
  password: 'Qwertyui0p',
  confirmPassword: 'Qwertyui0p',
};

describe('User signup', () => {
  const token = JwtHelper.createToken({ email: user.email }, '24h');
  it('should create the user and send verification email', (done) => {
    chai.request(app).post('/api/v1/auth/signup').send(user).end((err, res) => {
      res.status.should.eql(201);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('message').eql('User signup successful and verification email sent.');
      done();
    });
  });

  it('should re-send the verification email when requested by the user', (done) => {
    chai.request(app).post('/api/v1/auth/verify').send({ email: user.email }).end((err, res) => {
      res.status.should.eql(201);
      res.body.should.be.an('object').with.property('message').include('Email verification link re-sent successfully');
      done();
    });
  });

  it('should not re-send the verification email when requested by the user  if no email is sent', (done) => {
    chai.request(app).post('/api/v1/auth/verify').send({ }).end((err, res) => {
      res.status.should.eql(400);
      res.body.should.be.an('object').with.property('errors');
      done();
    });
  });

  it('should activate the user if inactivated, and valid token supplied', (done) => {
    chai.request(app).get(`/api/v1/auth/verify?evc=${token}`).end((err, res) => {
      res.status.should.eql(200);
      res.body.should.be.an('object').with.property('message').include('Account successfully verified and logged in');
      res.body.should.have.nested.property('user.token');
      done();
    });
  });

  it('should return error if the user has already been verified', (done) => {
    chai.request(app).get(`/api/v1/auth/verify?evc=${token}`).end((err, res) => {
      res.status.should.eql(400);
      res.body.should.be.an('object').with.property('message').include('The account has already been verified.');
      done();
    });
  });

  it('should return error if the user has already been verified', (done) => {
    chai.request(app).get('/api/v1/auth/verify?evc=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlYXlvbWlAZ21haWwuY29tIiw').end((err, res) => {
      res.status.should.eql(401);
      res.body.should.be.an('object').with.property('message').include('This verification link is invalid or expired. Please try again');
      done();
    });
  });

  it('should error if a user tries to verify without a token', (done) => {
    chai.request(app).get('/api/v1/auth/verify').end((err, res) => {
      res.status.should.eql(401);
      res.body.should.be.an('object').with.property('message').include('Please click the link sent to your email to verify your account.');
      done();
    });
  });

  it('should return 400 when a user does not provide a firstName', (done) => {
    chai.request(app).post('/api/v1/auth/signup').send({
      lastName: 'Yomi',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'Doe',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
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

  it('should return 400 when a user does not provide a password', (done) => {
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
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
    chai.request(app).post('/api/v1/auth/signup').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
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
    chai.request(app).post('/api/v1/auth/signup').send(userWithAlreadyUsedEmail).end((req, res) => {
      res.status.should.eql(409);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('errors');
      res.body.errors.should.be.a('object');
      res.body.errors.should.have.property('email').include('User with email: testuser@test.com already exists.');
      done();
    });
  });

  it('should automatically create a username for the user from their first name', () => {
    const username = AuthController.createUsername(user.firstName);
    username.should.be.a('string');
    username.should.include('-');
  });
});
