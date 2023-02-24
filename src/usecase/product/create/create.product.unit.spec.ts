import CreateProductUseCase from "./create.product.usecase";

const input = {
  name: "testProduct",
  price: 100,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn()
  };
};

describe("Unit Test - create product use case", () => {
  it("should create product", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price
    });
  })

  it("should throw error if name is missing", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    await expect(createProductUseCase.execute({ name: "", price: input.price})).rejects.toThrow("Name is required");
  })

  it("should throw error if price is less than zero", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    await expect(createProductUseCase.execute({ name: input.name, price: -10 })).rejects.toThrow("Price must be greater than zero");
  })
});
