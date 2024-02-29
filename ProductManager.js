const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        try {
            console.log(product);
    
            const products = await this.getProducts();
            product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            products.push(product);
    
            try {
                await this.saveProduct(products);
            } catch (saveError) {
                console.error('Error al guardar productos:', saveError.message);
                
                throw new Error('Error al añadir un producto:' + saveError.message);
            }
    
            return product.id;
        } catch (error) {
            throw new Error('Error al añadir un producto:' + error.message);
        }
    }

  async getProducts() {
    try {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT' || error.message.includes('Unexpected non-whitespace character')) {
            return [];
        } else {
            throw new Error('Error al leer los productos: ' + error.message);
        }
    }
}

async getProductById(id) {
    try {
        const products = await this.getProducts();
        const product = products.find(product => product.id === id);
        if (product) {
            return product;
        } 
    } catch (error) {
        throw new Error('Error al obtener el producto por ID: ' + error.message);
    }
}

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await this.saveProduct(products);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error('Error al actualizar un producto:' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            products = products.filter(product => product.id !== id);
            await this.saveProduct(products);
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el producto:' + error.message);
        }
    }

    async saveProduct(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        } catch (error) {
            throw new Error('Error al guardar el producto: ' + error.message);
        }
    }
} 


const productManager = new ProductManager('products.json');

(async () => {
    try {
        const productId = await productManager.addProduct({
            title: 'Playstation 5',
            description: 'Una consola de videojuegos que te brindara horas de entretenimiento',
            price: 1000000,
            thumbnail: 'playstation5.jpg',
            code: 'PS005',
            stock: 10
        });
        console.log('Producto añadido por id:', productId);

        const products = await productManager.getProducts();
        console.log('Todos los productos:', products);

        // producto playstation 
        const playstation5 = await productManager.getProductById(productId);
        console.log('Producto con id', productId, ':', playstation5);

        await productManager.updateProduct(productId, { price: 1000000 });
        console.log('Producto actualizado correctamente');

        await productManager.deleteProduct(productId);
        console.log('Producto eliminado correctamente');

    } catch (error) {
        console.error(error);
    }
})();