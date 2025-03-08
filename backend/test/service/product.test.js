const { pool } = require("../../database");
const { getProductDetail, getProducts } = require("../../services/products");

describe("Product Service", () => {
  describe("getProductById", () => {
    it("should return a product when given a valid ID", async () => {
      const productId = 1;
      const product = { id: 1, title: "Kursi" };

      pool.query = jest.fn(() => {
        return {
          rows: [product],
        };
      });

      const result = await getProductDetail(productId);
      expect(result).toEqual(product);
    });

    it("should throw error when product not exist", async () => {
      const productId = 999;

      pool.query = jest.fn(() => {
        return { rows: [] };
      });

      try {
        await getProductDetail(productId);
      } catch (error) {
        expect(error.message).toEqual("Product not found");
      }
    });
  });
});
