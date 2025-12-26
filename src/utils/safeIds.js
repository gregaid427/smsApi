import { generateId } from "./safeIds.js";

/**
 * Ensures generated ID does not already exist
 */
export const generateUniqueId = async (pool, table) => {
  let id;
  let exists = true;

  while (exists) {
    id = generateId();

    const [rows] = await pool
      .promise()
      .query(`SELECT id FROM ${table} WHERE id=? LIMIT 1`, [id]);

    exists = rows.length > 0;
  }

  return id;
};
