const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, 'livros.json');

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


const readBooksFromFile = () => {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  };
  
 
  const writeBooksToFile = (books) => {
    fs.writeFileSync(dataFile, JSON.stringify(books, null, 2));
  };
  
  
  app.get('/livros', (req, res) => {
    const livros = readBooksFromFile();
    res.json(livros);
  });
  

  app.post('/livros', (req, res) => {
    const newBook = req.body;
    const livros = readBooksFromFile();
    
    livros.push(newBook);
    writeBooksToFile(livros);
  
    res.status(201).json(newBook);
  });
  

  app.post('/livros/comprar', (req, res) => {
    const { nome } = req.body;
    const livros = readBooksFromFile();
    const livro = livros.find(livro => livro.nome === nome);
  
    if (livro && livro.quantidade > 0) {
      livro.quantidade -= 1;
      writeBooksToFile(livros);
      res.json({ message: `Compra realizada com sucesso! Exemplares restantes: ${livro.quantidade}` });
    } else if (livro && livro.quantidade === 0) {
      res.status(400).json({ message: 'Livro esgotado!' });
    } else {
      res.status(404).json({ message: 'Livro não encontrado!' });
    }
  });
  