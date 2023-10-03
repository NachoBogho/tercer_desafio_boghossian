import { promises as fsPromises } from 'fs';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  loadProducts = async () => {
    try {
      const data = await fsPromises.readFile(this.path, 'utf-8');
      console.log('Contenido del archivo JSON:', data);
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      return [];
    }
  }

  saveProducts = async (products) => {
    await fsPromises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
  };

  addProduct = async (product) => {
    // Asignar un ID autoincrementable
    const products = await this.loadProducts();
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    product.id = lastId + 1;

    // Agregar el producto al arreglo
    products.push(product);
    await this.saveProducts(products);
  };

  getProducts = async () => {
    return await this.loadProducts();
  };

  getProductById = async (id) => {
    const products = await this.loadProducts();
    const product = products.find((p) => p.id === id);
    return product || null;
  };

  updateProduct = async (id, updatedProduct) => {
    const products = await this.loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Actualizar el producto sin cambiar su ID
      updatedProduct.id = products[index].id;
      products[index] = updatedProduct;
      await this.saveProducts(products);
      return true;
    }
    return false; // Producto no encontrado
  };

  deleteProduct = async (id) => {
    const products = await this.loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Eliminar el producto por su ID
      products.splice(index, 1);
      await this.saveProducts(products);
      return true;
    }
    return false; // Producto no encontrado
  };
}

export default ProductManager;
