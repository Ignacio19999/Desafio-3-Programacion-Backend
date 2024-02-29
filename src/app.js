const express = require('express');
const ProductManager = require('../ProductManager'); 


const app = express();
const PORT = 3000; 


app.get('/products', (req, res) => {
    let limit = req.query.limit; 

    
    let products = ProductManager.getAllProducts();

    
    if (limit) {
        products = products.slice(0, parseInt(limit));
    }

   
    res.json(products);
});


app.get('/products/:pid', (req, res) => {
    const productId = req.params.pid; 

   
    const product = ProductManager.getProductById(productId);

    
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    
    res.json(product);
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});