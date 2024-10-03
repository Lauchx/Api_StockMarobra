const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('node:crypto')

const app = express();
app.disable('X-Powered-By')
const PORT = process.env.PORT ?? 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(cors());
/*  
Usando solo origenes que vos quieras que tengan  acceso a tu API
app.us(cors({
origin: (origin, callback)=>{
const  allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
}
if  (allowedOrigins.includes(origin) || !origin) {
    return  callback(null, true);
}))
return   callback(new Error('Not allowed by CORS'));

*/
// NO BORRAR LOS COMENTARIOS. GRACIAS <3
//app.use(bodyParser.json());
app.use(express.json())


const dataProducts = require('./products.json');
const { validateProduct } = require('./schemas/products');

// Endpoint para obtener los datos
app.get('/products', (req, res) => {
    res.json(dataProducts);
});

// Endpoint para agregar un nuevo dato
app.post('/products', (req, res) => {
    const result = validateProduct(req.body)

    if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
    }
    const newProduct = {
        id: crypto.randomUUID(),
        ...result.data,
    }

    dataProducts.push(newProduct);
    res.status(201).json(newProduct);
});


app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const result = validateProduct(req.body)

    if (!result.success) {
        return res.status(422).json({ error: result.error.issues })
    }
    const productIndex = dataProducts.findIndex(p => p.id === id)

    if (productIndex === -1) {
        return res.status(404).send('Item not found');
    }
    const updatedProduct = {
        ...dataProducts[productIndex],
        ...result.data, 
    }
    dataProducts[productIndex] = updatedProduct;

    res.status(200).json(updatedProduct);
});

// Endpoint para eliminar un dato
app.delete('/products/:id', (req, res) => {
    //const id = parseInt(req.params.id);
    const id = req.params.id;
    console.log(id + "ID")

    const productIndex = dataProducts.findIndex(p => p.id === id)

    if (productIndex === -1) {
        return res.status(404).send('Item not found');
    }
    dataProducts.splice(productIndex, 1)
    return res.json({ message: "Product deleted" })

});

//seleccionar por id
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = dataProducts.find(product => product.id === id);

    if (product) {
        return res.json(product);
    }
    return res.status(404).json({ error: 'Item not found' });

});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}`);
});

