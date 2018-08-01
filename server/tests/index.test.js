import { } from 'dotenv/config';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();
chai.use(chaiHttp);

describe('ALL /api/', () => {
  it('should return 200 when base url is requested', (done) => {
    chai.request(app).get('/api/').end((req, res) => {
      res.status.should.eql(200);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('message').eql('Welcome to Author\'s Haven API');
      done();
    });
  });

  it('should return 404 when an un-available url is requested', (done) => {
    chai.request(app).get('/api/9i').end((req, res) => {
      res.status.should.eql(404);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route unavailable on this server');
      done();
    });
  });
});
