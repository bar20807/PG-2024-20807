import express from "express";
import dotenv from "dotenv";
import clientDB from "../models/player.js";
import { Resend } from "resend";
import { authenticateToken, isAdmin } from "../middlewares/authentication.js";

dotenv.config();

const adminsRouter = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint para obtener todos los jugadores
adminsRouter.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const query = `
        SELECT *
        FROM player
      `;
    const result = await clientDB.query(query);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No players found" });
    }

    const players = result.rows;

    res.status(200).json({ success: true, players });
  } catch (err) {
    console.error("Error fetching players data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint para cambiar el estatus de administrador de un usuario
adminsRouter.put(
  "/make_admin/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const playerId = req.params.id;
    const { isAdmin } = req.body; // Se espera un booleano en el body para el nuevo estado de admin

    try {
      // Verificar si el usuario existe
      const checkQuery = `SELECT * FROM player WHERE id = $1`;
      const checkResult = await clientDB.query(checkQuery, [playerId]);

      if (checkResult.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Player not found" });
      }

      // Actualizar el estatus de administrador
      const updateQuery = `
      UPDATE player SET is_admin = $1 WHERE id = $2
    `;
      const result = await clientDB.query(updateQuery, [isAdmin, playerId]);

      if (result.rowCount === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to update admin status" });
      }

      res
        .status(200)
        .json({ success: true, message: "Admin status updated successfully" });
    } catch (err) {
      console.error("Error updating admin status:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Endpoint para agregar una noticia
adminsRouter.post("/add_new", authenticateToken, isAdmin, async (req, res) => {
  const { title, author, content, image } = req.body; // Se eliminan 'date' y 'time' del body

  try {
    const query = `
      INSERT INTO news (title, author, date, time, content, image)
      VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4) RETURNING *
    `;
    const values = [title, author, content, image];
    const result = await clientDB.query(query, values);

    res.status(201).json({
      success: true,
      message: "News added successfully",
      news: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding news:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint para obtener estadísticas del último mes
adminsRouter.get("/stats", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Consulta 1: Crecimiento mensual de la base de jugadores en el último año
    const newPlayersQuery = `
      SELECT DATE_TRUNC('month', login_date) AS month, COUNT(*) AS new_players
      FROM player
      WHERE login_date >= CURRENT_DATE - INTERVAL '1 year'
      GROUP BY month
      ORDER BY month;
      `;
    const newPlayersResult = await clientDB.query(newPlayersQuery);
    const newPlayers = newPlayersResult.rows;

    // Consulta 2: Actividad general (número de sesiones de juego) en el último año por mes
    const totalSessionsQuery = `
        SELECT DATE_TRUNC('month', date) AS month, COUNT(*) AS total_sessions
        FROM game_sessions
        WHERE date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY month
        ORDER BY month;
        `;
    const totalSessionsResult = await clientDB.query(totalSessionsQuery);
    const totalSessions = totalSessionsResult.rows;

    // Consulta 3: Duración promedio de las sesiones en el último año por mes
    const avgDurationQuery = `
      SELECT DATE_TRUNC('month', date) AS month, AVG(duration_level) AS avg_duration
      FROM game_sessions
      WHERE date >= CURRENT_DATE - INTERVAL '1 year'
      GROUP BY month
      ORDER BY month;
      `;

    const avgDurationResult = await clientDB.query(avgDurationQuery);
    const avgDuration = avgDurationResult.rows;

    // Consulta 4: Tendencias de niveles jugados y resultados de juego
    const gameTrendsQuery = `
      SELECT 
        level, 
        COUNT(*) AS level_count, 
        AVG(CASE WHEN game_result = 'win' THEN 1 ELSE 0 END) AS win_rate
      FROM game_sessions
      WHERE date >= CURRENT_DATE - INTERVAL '1 month'
      GROUP BY level
      ORDER BY level_count DESC
      LIMIT 5
    `;
    const gameTrendsResult = await clientDB.query(gameTrendsQuery);
    const gameTrends = gameTrendsResult.rows;

    // Consulta 5: Frecuencia de uso de elementos del juego en el último mes
    const itemUsageQuery = `
      SELECT 
        SUM(frequency_barringtonia) AS total_barringtonia,
        SUM(frequency_spaggetti) AS total_spaggetti,
        SUM(frequency_jelly) AS total_jelly,
        SUM(frequency_hot_tea) AS total_hot_tea,
        SUM(frequency_cake) AS total_cake,
        SUM(frequency_melee_attack) AS total_melee_attack
      FROM game_sessions
      WHERE date >= CURRENT_DATE - INTERVAL '1 month'
    `;
    const itemUsageResult = await clientDB.query(itemUsageQuery);
    const itemUsage = itemUsageResult.rows[0];

    // Construir la respuesta con todos los datos
    res.status(200).json({
      success: true,
      stats: {
        newPlayers,
        totalSessions,
        avgDuration,
        gameTrends,
        itemUsage,
      },
    });
  } catch (err) {
    console.error("Error fetching monthly stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint para enviar correos promocionales a todos los usuarios, uno por uno
adminsRouter.post(
  "/send_promo",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { title, author, content, image } = req.body;

    try {
      // Recuperar todos los correos de los usuarios activos
      const query = `SELECT email FROM player WHERE is_deleted = false`;
      const result = await clientDB.query(query);

      const emails = result.rows.map((user) => user.email);

      if (emails.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No users found to send emails." });
      }

      // Configurar el contenido del correo con estilos en línea
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #362C2B; color: #FFF; border-radius: 10px;">
          <!-- Logo en la parte superior -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.platyfa-game.com/static/images/logo_V1.png" alt="Platyfa Logo" style="height: 50px;">
          </div>

          <!-- Título de la promoción -->
          <div style="background-color: #4F3A39; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; color: #F9C784; margin: 0;">${title}</h1>
            <p style="color: #EDEDED; font-size: 14px; margin: 0;">by <strong>${author}</strong></p>
          </div>

          <!-- Contenido de la promoción -->
          <div style="padding: 15px; background-color: #2C1E16; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #EDEDED; line-height: 1.6; font-size: 16px;">${content}</p>
          </div>

          <!-- Imagen de la promoción -->
          ${
            image
              ? `<div style="text-align: center; margin-bottom: 20px;">
                  <img src="${image}" alt="Promotion Image" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                </div>`
              : ""
          }

          <!-- Pie de página -->
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #AAA;">
            <p style="margin: 0;">&copy; 2024 Platyfa Games. All rights reserved.</p>
          </div>
        </div>
      `;

      // Enviar correos uno por uno con un intervalo de espera
      for (const email of emails) {
        try {
          await resend.emails.send({
            from: "platyfa.promotions@platyfa-game.com", // Debe ser una dirección verificada en Resend
            to: email,
            subject: `${title}`,
            html: emailContent,
          });

          // Esperar 2 segundos antes de enviar el siguiente correo
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error enviando correo a ${email}:`, error);
        }
      }

      res.status(200).json({
        success: true,
        message: "Promoción enviada exitosamente a todos los usuarios",
      });
    } catch (err) {
      console.error("Error sending promotion email:", err);
      res.status(500).json({
        success: false,
        message: "Error del servidor al enviar el correo",
      });
    }
  }
);

export default adminsRouter;
