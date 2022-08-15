const { expect } = require('chai');
const { describe } = require('mocha');
const sinon = require('sinon');
const connection = require('../../../models/connection');

const Products = require('../../../models/Products');

describe('Model -  Busca apenas um produto no BD por seu ID', () => {
  before(async () => {
    const query = [[]];
    sinon.stub(connection, 'query').resolves(query);
  });
  after(async () => {
    connection.query.restore();
  });
  describe('quando não existe um produto com o ID informado', () => {
    it('retorna undefined', async () => {
      const response = await Products.getByPk();
      expect(response).to.be.equal(undefined);
    });
  });
  describe('quando existe um produto com o ID informado', () => {
    before(() => {
      sinon.stub(Products, 'getByPk')
        .resolves(
          {
            "id": 1,
            "name": "Martelo de Thor"
          }
        );
    });
    after(() => {
      Products.getByPk.restore();
    });
    it('retorna um objeto', async () => {
      const response = await  Products.getByPk(1);

      expect(response).to.be.an('object');
    });
    it('o objeto não está vazio', async () => {
      const response = await  Products.getByPk(1);
      expect(response).to.be.not.empty;
    });
    it('tal objeto possui as propriedades: "id", "name"', async () => {
      const item = await Products.getByPk(1);
      expect(item).to.include.all.keys('id', 'name');
    });
  });
});

describe('Model - Busca todos os produtos no BD', () => {
  describe('quando não existe nenhum produto criado', () => {
    before(function () {
      const resultadoQuery = [[], []];
      sinon.stub(connection, 'query').resolves(resultadoQuery);
    });
    after(function () {
      connection.query.restore();
    });
    it('retorna um array', async function () {
      const result = await Products.getAll();
      expect(result).to.be.an('array');
    });
    it('o array vazio', async function () {
      const result = await Products.getAll();
      expect(result).to.be.empty;
    });
  });
  describe('quando exitem produtos criados', () => {
    before(function () {
      const resultadoQuery = [[{ id: 1, name: 'Martelo de Thor'}], []];
      sinon.stub(connection, 'query').resolves(resultadoQuery);
    });
    it('retorne um array', async function () {
      const resultado = await Products.getAll();
      expect(resultado).to.be.an('array');
    });
    it('o array não esteja vazio', async function () {
      const result = await Products.getAll();
      expect(result).to.be.not.empty;
    });
    it('o array possua itens do tipo objeto', async function () {
      const result = await Products.getAll();
      expect(result[0]).to.be.an('object');
    });
    it('objetos tenham as propriedades: "id", "name"', async function () {
      const result = await Products.getAll();
      const item = result[0];
      expect(item).to.include.all.keys('id', 'name');
    });
  });
});

describe('Model - Cria um novo produto no BD', () => {
  const newProductName = 'ProdutoX';
  before(() => {
    sinon.stub(Products, 'create')
      .resolves(
        {
          "id": 4,
          "name": "ProdutoX"
        }
      );
  });
  after(() => {
    Products.create.restore();
  });
  it('retorna um objeto', async () => {
    const response = await  Products.create(newProductName);

    expect(response).to.be.an('object');
  });
  it('o objeto não está vazio', async () => {
    const response = await Products.create(newProductName);
    
    expect(response).to.be.not.empty;
  });
  it('tal objeto possui as propriedades: "id", "name"', async () => {
    const item = await Products.create();
    
    expect(item).to.include.all.keys('id', 'name');
  });
});