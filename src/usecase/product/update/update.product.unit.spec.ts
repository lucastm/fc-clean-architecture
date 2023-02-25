import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import { v4 as uuid } from "uuid";

const product = new Product(uuid(), "testProduct", 100);

const input = {
  id: product.id,
  name: "testProductUpdated",
  price: 200
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
  it("should throw error if product with id wasn't found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    await expect(productUpdateUseCase.execute({ ...input, id: uuid()})).rejects.toThrow(
      "Product not found"
    );
  });
});
