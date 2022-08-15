const { expect } = require('chai');
const { describe } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');

const Sales = require('../../../models/Sales');

describe('Model -  Busca apenas uma venda no BD por seu ID', () => {
  before(async () => {
    const query = [[]];
    sinon.stub(connection, 'query').resolves(query);
  });
  after(async () => {
    connection.query.restore();
  });
  describe('quando não existe uma venda com o ID informado', () => {
    it('retorna undefined', async () => {
      const response = await Sales.getByPk();
      expect(response).to.be.equal(undefined);
    });
  });
  describe('quando existe uma venda com o ID informado', () => {
    before(() => {
      sinon.stub(Sales, 'getByPk')
        .resolves(
          [
            {
              "date": "2021-09-09T04:54:29.000Z",
              "productId": 1,
              "quantity": 2
            },
            {
              "date": "2021-09-09T04:54:54.000Z",
              "productId": 2,
              "quantity": 2
            }
          ]
        );
    });
    after(() => {
      Sales.getByPk.restore();
    });
    it('retorna uma array', async () => {
      const response = await  Sales.getByPk(1);

      expect(response).to.be.an('array');
    });
    it('a array não está vazia', async () => {
      const response = await  Sales.getByPk(1);
      expect(response).to.be.not.empty;
    });
    it('tal array possui as propriedades: "date", "productId", "quantity"', async () => {
      const item = await Sales.getByPk(1);
      expect(item).to.include.all.keys('date', 'productId', 'quantity');
    });
  });
});

describe('Model - Busca todas as vendas no BD', () => {
  describe('quando não existe nenhuma venda criada', () => {
    before(function () {
      const resultadoQuery = [[], []];
      sinon.stub(connection, 'query').resolves(resultadoQuery);
    });
    after(function () {
      connection.query.restore();
    });
    it('retorna um array', async function () {
      const result = await Sales.getAll();
      expect(result).to.be.an('array');
    });
    it('o array vazio', async function () {
      const result = await Sales.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('quando exitem vendas criados', () => {
    before(function () {
      const resultadoQuery = [[{ saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2}], []];
      sinon.stub(connection, 'query').resolves(resultadoQuery);
    });
    it('retorne um array', async function () {
      const resultado = await Sales.getAll();
      expect(resultado).to.be.an('array');
    });
    it('o array não esteja vazio', async function () {
      const result = await Sales.getAll();
      expect(result).to.be.not.empty;
    });
    it('o array possua itens do tipo objeto', async function () {
      const result = await Sales.getAll();
      expect(result[0]).to.be.an('object');
    });
    it('objetos tenham as propriedades: "saleId", "date", "productId", "quantity"', async function () {
      const result = await Sales.getAll();
      const item = result[0];
      expect(item).to.include.all.keys('saleId', 'date', 'productId', 'quantity');
    });
  });
});

// describe('Model - Cria um novo produto no BD', () => {
//   const newProductName = 'ProdutoX';
//   before(() => {
//     sinon.stub(Products, 'create')
//       .resolves(
//         {
//           "id": 4,
//           "name": "ProdutoX"
//         }
//       );
//   });
//   after(() => {
//     Products.create.restore();
//   });
//   it('retorna um objeto', async () => {
//     const response = await  Products.create(newProductName);

//     expect(response).to.be.an('object');
//   });
//   it('o objeto não está vazio', async () => {
//     const response = await Products.create(newProductName);
    
//     expect(response).to.be.not.empty;
//   });
//   it('tal objeto possui as propriedades: "id", "name"', async () => {
//     const item = await Products.create();
    
//     expect(item).to.include.all.keys('id', 'name');
//   });
// });