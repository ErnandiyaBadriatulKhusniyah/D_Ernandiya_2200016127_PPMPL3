const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('API Testing', () => {
  it('should return all items', (done) => {
    request(app)
      .get('/api/items')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
        done();
      });
  });

  it('should return the correct item when getting by ID', (done) => {
    const expectedItem = { id: 2, name: 'Item 2' }; 
    request(app)
      .get('/api/items/2')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', expectedItem.id);
        expect(res.body).to.have.property('name', expectedItem.name);
        done();
      });
  });  

  it('should create a new item', (done) => {
    const newItem = { name: 'Item 3' };
    request(app)
      .post('/api/items')
      .send(newItem)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'Item 3');
        done();
      });
  });

  it('should retrieve the newly created item by ID', (done) => {
    const newItemId = 3;
    request(app)
      .get(`/api/items/${newItemId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', newItemId);
        expect(res.body).to.have.property('name', 'Item 3');
        done();
      });
  });  

  it('should update an item', (done) => {
    const updatedItem = { name: 'Updated Item 1' };
    request(app)
      .put('/api/items/1')
      .send(updatedItem)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', 1);
        expect(res.body).to.have.property('name', 'Updated Item 1');
        done();
      });
  });

  it('should return 400 if required fields are missing during update', (done) => {
    const invalidItem = { description: 'Missing name field' }; 
    request(app)
      .put('/api/items/3') 
      .send(invalidItem)
      .end((err, res) => {
        expect(res.status).to.equal(400); 
        expect(res.body).to.have.property('message', 'Name field is required'); 
        done();
      });
  });   

  it('should return 404 when updating a non-existing item', (done) => {
    const updatedItem = { name: 'Non-existing Item' };
    request(app)
      .put('/api/items/999')
      .send(updatedItem)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Item not found');
        done();
      });
  });

  it('should delete an item', (done) => {
    request(app)
      .delete('/api/items/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Item deleted successfully');
        done();
      });
  });

  it('should return 404 when deleting a non-existing item', (done) => {
    request(app)
      .delete('/api/items/999')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Item not found');
        done();
      });
  });

  it('should return 404 when trying to retrieve a deleted item', (done) => {
    const deletedItemId = 1;
    request(app)
      .get(`/api/items/${deletedItemId}`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Item not found');
        done();
      });
  });
  
});