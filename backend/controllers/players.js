import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import clientDB from "../models/player.js";
import { authenticateToken } from "../middlewares/authentication.js";
import config from "../utils/config.js";
import { Resend } from "resend";
import crypto from "crypto";

// Configurar dotenv
dotenv.config();

// Crear el router de express
const playersRouter = express.Router();
const date = new Date();
const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint para registrar nuevos jugadores
playersRouter.post("/register", async (req, res) => {
  const { username, name, email, password, country, language, game_language } =
    req.body;

  try {
    // Verifica si el email ya existe
    const existingUser = await clientDB.query(
      "SELECT id FROM player WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
    const query = `
      INSERT INTO player (username, name, email, login_date, password, country, language, game_language, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await clientDB.query(query, [
      username,
      name,
      email,
      date,
      hashedPassword,
      country,
      language,
      game_language,
      true,
    ]);

    res.status(200).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Endpoint para marcar un jugador como eliminado
playersRouter.delete("/delete/:id", authenticateToken, async (req, res) => {
  const playerId = req.params.id;

  try {
    const query = `
      UPDATE player SET is_deleted = TRUE WHERE id = $1
    `;
    const result = await clientDB.query(query, [playerId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Endpoint para restaurar una cuenta eliminada
playersRouter.post("/restore", authenticateToken, async (req, res) => {
  const { playerId } = req.body;
  const requesterId = req.userId; // ID del usuario del token
  const isAdmin = req.isAdmin; // Verificar si es administrador desde el token

  try {
    // Verificar si el usuario es administrador
    const targetPlayerId = isAdmin ? playerId : requesterId;

    // Restaurar la cuenta del usuario objetivo
    const query = `
      UPDATE player SET is_deleted = FALSE WHERE id = $1
    `;
    const result = await clientDB.query(query, [targetPlayerId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Account restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

playersRouter.put("/update_profile", authenticateToken, async (req, res) => {
  const { username, country, password, profileImage, email } = req.body;
  try {
    let updates = [];
    let values = [];
    let index = 1;

    if (username) {
      updates.push(`username = $${index}`);
      values.push(username);
      index++;
    }

    if (country) {
      updates.push(`country = $${index}`);
      values.push(country);
      index++;
    }

    if (profileImage) {
      updates.push(`profile_image = $${index}`);
      values.push(profileImage); // URL de la imagen
      index++;
    }

    if (email) {
      updates.push(`email = $${index}`);
      values.push(email);
      index++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${index}`);
      values.push(hashedPassword);
      index++;
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    const query = `UPDATE player SET ${updates.join(
      ", "
    )} WHERE id = $${index}`;
    values.push(req.userId);

    await clientDB.query(query, values);

    /*if (email) {
      const token = generateVerificationToken(email);
      await sendVerificationEmail(email, token);
    }*/

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

playersRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `
      SELECT id, password, is_deleted, is_admin FROM player WHERE username = $1
    `;
    const result = await clientDB.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "User incorrect" });
    }

    const user = result.rows[0];

    // Verificar si la cuenta está eliminada antes de continuar
    if (user.is_deleted) {
      return res.status(403).json({ message: "Account is deleted" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generar token solo después de que la verificación de contraseña haya sido exitosa
    const token = jwt.sign(
      {
        id: user.id,
        username: username,
        is_admin: user.is_admin,
        is_deleted: user.is_deleted,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Endpoint para solicitar restablecimiento de contraseña
playersRouter.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const query = `SELECT * FROM player WHERE email = $1`;
    const result = await clientDB.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Email not found." });
    }

    const user = result.rows[0];

    // Generar token y fecha de expiración
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = new Date(Date.now() + 3600000).toISOString();

    // Guardar el token y expiración en la base de datos
    await clientDB.query(
      `UPDATE player SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3`,
      [resetToken, resetTokenExpiration, email]
    );

    // Enviar el correo con Resend
    const resetLink = `${process.env.CLIENT_URL_PROD}/reset_password/${resetToken}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #362C2B; color: #FFF;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://www.platyfa-game.com/static/images/logo_V1.png" alt="Platyfa Logo" style="height: 50px;">
        </div>
        <div style="background-color: #4F3A39; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #F9C784; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="color: #EDEDED; line-height: 1.6; margin-bottom: 20px;">
            Hello,
          </p>
          <p style="color: #EDEDED; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Platyfa account. Click the button below to proceed:
          </p>
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${resetLink}" style="text-decoration: none; background-color: #F9C784; color: #362C2B; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #EDEDED; line-height: 1.6; margin-bottom: 20px;">
            If you did not request this, please ignore this email. This link will expire in 1 hour.
          </p>
          <p style="color: #EDEDED; line-height: 1.6;">
            Regards,<br>
            The Platyfa Team
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #AAA;">
          <p style="margin: 0;">&copy; 2024 Platyfa Games. All rights reserved.</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "no-reply@platyfa-game.com",
      to: email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Endpoint para restablecer la contraseña
playersRouter.post("/reset_password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Cambia Date.now() a new Date().toISOString() para el formato adecuado
    const query = `SELECT * FROM player WHERE reset_token = $1 AND reset_token_expiration > $2`;
    const result = await clientDB.query(query, [
      token,
      new Date().toISOString(),
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = result.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña y eliminar el token
    await clientDB.query(
      `UPDATE player SET password = $1, reset_token = NULL, reset_token_expiration = NULL WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Endpoint para verificar si el token es válido
playersRouter.get("/validate_reset_token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const currentDateTime = new Date().toISOString();

    // Buscar al usuario por el token y verificar expiración
    const query = `SELECT * FROM player WHERE reset_token = $1 AND reset_token_expiration > $2`;
    const result = await clientDB.query(query, [token, currentDateTime]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ valid: false, message: "Invalid or expired token." });
    }

    res.status(200).json({ valid: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Endpoint para guardar sesiones de juego
playersRouter.post("/game_sessions", authenticateToken, async (req, res) => {
  if (req.isDeleted) {
    return res.status(403).json({ message: "Account is deleted" });
  }

  const {
    level,
    duration_level,
    game_result,
    kills,
    jumps,
    damage_received,
    frequency_barringtonia,
    frequency_spaggetti,
    frequency_jelly,
    frequency_hot_tea,
    frequency_cake,
    frequency_melee_attack,
    impact_barringtonia,
    impact_spaggetti,
    impact_jelly,
    impact_hot_tea,
    impact_cake,
    impact_melee_attack,
  } = req.body;

  const date = new Date();

  try {
    const query = `
      INSERT INTO game_sessions (id_player, date, level, duration_level, game_result, kills, jumps, damage_received, 
      frequency_barringtonia, frequency_spaggetti, frequency_jelly, frequency_hot_tea, frequency_cake, frequency_melee_attack, 
      impact_barringtonia, impact_spaggetti, impact_jelly, impact_hot_tea, impact_cake, impact_melee_attack)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
      RETURNING id
    `;
    const values = [
      req.userId,
      date,
      level,
      duration_level,
      game_result,
      kills,
      jumps,
      damage_received,
      frequency_barringtonia,
      frequency_spaggetti,
      frequency_jelly,
      frequency_hot_tea,
      frequency_cake,
      frequency_melee_attack,
      impact_barringtonia,
      impact_spaggetti,
      impact_jelly,
      impact_hot_tea,
      impact_cake,
      impact_melee_attack,
    ];
    const result = await clientDB.query(query, values);
    res.status(200).json({ success: true, gameSessionId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

playersRouter.get("/game_statistics", authenticateToken, async (req, res) => {
  if (req.isDeleted) {
    return res.status(403).json({ message: "Account is deleted" });
  }

  try {
    const query = `
      SELECT 
        TO_CHAR(date, 'Month') as month, 
        COUNT(*) as sessions_count,
        AVG(kills) as avg_kills,
        AVG(jumps) as avg_jumps,
        AVG(damage_received) as avg_damage_received,
        SUM(duration_level) as total_duration,
        SUM(kills) as total_kills,
        SUM(damage_received) as total_damage_received,
        AVG(frequency_barringtonia) as avg_frequency_barringtonia,
        AVG(frequency_spaggetti) as avg_frequency_spaggetti,
        AVG(frequency_jelly) as avg_frequency_jelly,
        AVG(frequency_hot_tea) as avg_frequency_hot_tea,
        AVG(frequency_cake) as avg_frequency_cake,
        AVG(frequency_melee_attack) as avg_frequency_melee_attack,
        AVG(impact_barringtonia) as avg_impact_barringtonia,
        AVG(impact_spaggetti) as avg_impact_spaggetti,
        AVG(impact_jelly) as avg_impact_jelly,
        AVG(impact_hot_tea) as avg_impact_hot_tea,
        AVG(impact_cake) as avg_impact_cake,
        AVG(impact_melee_attack) as avg_impact_melee_attack,
        SUM(CASE WHEN game_result = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN game_result = 'loss' THEN 1 ELSE 0 END) as losses
      FROM game_sessions
      WHERE id_player = $1
      GROUP BY TO_CHAR(date, 'Month')
      ORDER BY TO_CHAR(date, 'Month')
    `;

    const result = await clientDB.query(query, [req.userId]);
    res.status(200).json({ success: true, statistics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Endpoint para obtener todas las noticias
playersRouter.get("/news", async (req, res) => {
  try {
    const order = req.query.order === "asc" ? "ASC" : "DESC";
    const query = `
      SELECT news.id, news.title, news.author, news.date, news.content, news.image, player.profile_image
      FROM news
      JOIN player ON news.author = player.username
      ORDER BY news.date ${order}, news.id ${order}
    `;
    const result = await clientDB.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No news found" });
    }

    res.status(200).json({ success: true, news: result.rows });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint para obtener la información de un jugador por ID
playersRouter.get("/:id", authenticateToken, async (req, res) => {
  const playerId = req.params.id;

  try {
    const query =
      "SELECT username, email, country, profile_image, language FROM player WHERE id = $1";
    const result = await clientDB.query(query, [playerId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }

    const player = result.rows[0];

    res.status(200).json({ success: true, player });
  } catch (err) {
    console.error("Error fetching player data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Exportar el router
export default playersRouter;
