const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string (Best for Supabase / Render / Vercel)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} else {
  // Use separate fields (Local development)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false,
    }
  );
}

sequelize.authenticate()
  .then(() => console.log(`✅ ${process.env.DATABASE_URL ? 'Cloud PostgreSQL' : 'Local ' + (process.env.DB_DIALECT || 'MySQL')} connected successfully.`))
  .catch((err) => console.error('❌ Database connection error:', err));

module.exports = sequelize;
