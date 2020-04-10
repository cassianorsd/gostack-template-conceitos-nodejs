const express = require("express");
const cors = require("cors");

const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (request,response,next) => {
  const { id } = request.params;
  if(!isUuid(id)) return response.status(400).json({error:"Invalid project ID."})
  return next();
}

app.use('/repositories/:id',validateId);

/**
 * LISTA TODOS OS REGISTROS
 * 
 */

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

/**
 * Cria registro de um novo repositorio.
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title,url,techs, likes:0};
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(repo=>repo.id===id);
  if(index<0) return response.status(400).json({error:'Repository not found!'});
  const oldRepo = repositories[index];
  const newRepo = {...oldRepo,title,url,techs};
  repositories[index] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo=>repo.id===id);
  if(index<0) return response.status(400).json({error:'Repository not found!'});
  repositories.splice(index,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo=>repo.id===id);
  if(index<0) return response.status(400).json({error:'Repository not found!'});
  const repo = repositories[index];
  repo.likes+=1;
  repositories[index] = repo;
  return response.status(200).send(repo);
});

module.exports = app;
