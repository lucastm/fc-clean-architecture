import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";
import FindProductUseCase from "./find.product.usecase";

const id = uuid();
const product = new Product(id, "testProduct", 100);

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Unit Test - find product use case", () => {
  it("should find product", async () => {
    const productRepository = MockRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);
    const input = { id };
    const output = {
      id,
      name: product.name,
      price: product.price,
    };
    const result = await findProductUseCase.execute(input);
    expect(productRepository.find).toHaveBeenCalledWith(id);
    expect(result).toEqual(output);
  });
  it("should throw error if product with id wasn't found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const findProductUseCase = new FindProductUseCase(productRepository);
    const input = { id: uuid() };
    await expect(findProductUseCase.execute(input)).rejects.toThrow(
      "Product not found"
    );
  });
});
