import express from 'express';
import ProductManager from './product_manager.js';

const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager('./src/productos.json');

app.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit);

  try {
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      console.log('Producto no encontrado');
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto por ID' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

