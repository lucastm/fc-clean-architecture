import { app, sequelize } from "../express";
import request from "supertest";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "testProduct",
        price: 100
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("testProduct");
    expect(response.body.price).toBe(100);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "testProduct",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product(uuid(), "testProduct", 100);
    const product2 = new Product(uuid(), "testProduct2", 200);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const productResponse = listResponse.body.products[0];
    expect(productResponse.name).toBe("testProduct");
    expect(productResponse.price).toBe(100);
    const product2Response = listResponse.body.products[1];
    expect(product2Response.name).toBe("testProduct2");
    expect(product2Response.price).toBe(200);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>testProduct</name>`);
    expect(listResponseXML.text).toContain(`<price>100</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>testProduct2</name>`);
    expect(listResponseXML.text).toContain(`<price>200</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
