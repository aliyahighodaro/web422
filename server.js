const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080
const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

app.use(cors());
app.use(express.json()); //

app.get('/', (req, res) => {
    res.json({
        "message": "API Listening",
    "term": "Summer 2025", 
    "student": "Aliyah Ighodaro"})
});

app.post("/api/sites", async (req, res) => {
    try {
      const newSite = await db.addNewSite(req.body);
      res.status(201).json(newSite);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.get("/api/sites", async (req, res) => {
    const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
    try {
      const sites = await db.getAllSites(page, perPage, name, region, provinceOrTerritoryName);
      res.json(sites);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.get("/api/sites/:id", async (req, res) => {
    try {
      const site = await db.getSiteById(req.params.id);
      if (!site) return res.status(404).json({ message: "Site not found" });
      res.json(site);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.put("/api/sites/:id", async (req, res) => {
    try {
      await db.updateSiteById(req.body, req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.delete("/api/sites/:id", async (req, res) => {
    try {
      await db.deleteSiteById(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(PORT, ()=>{
    console.log(`server listening on: ${PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
    })
