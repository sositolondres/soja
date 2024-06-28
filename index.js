import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/soja", async (req, res) => {
  try {
    // URL de la página web que contiene el precio de la soja
    const url = "https://www.cac.bcr.com.ar/es/precios-de-pizarra"; // Reemplaza con la URL correcta

    // Realiza la solicitud HTTP a la página web
    const { data } = await axios.get(url);

    // Carga el HTML en Cheerio
    const $ = cheerio.load(data);

    // Selecciona el elemento y obtiene su texto
    let price = $("div.boards-container > div.board.board-girasol > div > div.price").text();

    if (price.includes(",")) {
      price = price.split(",")[0];
    }
    else {
        price = $("div.boards-container > div.board.board-girasol > div > div.price-sc").text();
        price = price.split("(Estimativo) ")[1];
        price = price.split(",")[0];
    }

    // Responde con el precio
    res.json({ price: price.trim() });
  } catch (error) {
    console.error("Error scraping the website:", error);
    res.status(500).json({ error: "Failed to fetch the price of soja" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
