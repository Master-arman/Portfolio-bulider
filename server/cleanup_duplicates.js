/**
 * Cleanup Script: Remove duplicate portfolios for same userId
 * Keeps only the LATEST portfolio (highest id) for each userId
 */
const sequelize = require('./config/db');
const Portfolio = require('./models/Portfolio');

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Find all portfolios
    const allPortfolios = await Portfolio.findAll({
      order: [['userId', 'ASC'], ['id', 'DESC']]
    });

    console.log(`📊 Total portfolios in DB: ${allPortfolios.length}`);

    // Group by userId
    const grouped = {};
    allPortfolios.forEach(p => {
      if (!grouped[p.userId]) {
        grouped[p.userId] = [];
      }
      grouped[p.userId].push(p);
    });

    let deletedCount = 0;

    for (const [userId, portfolios] of Object.entries(grouped)) {
      if (portfolios.length > 1) {
        console.log(`\n⚠️  userId ${userId} has ${portfolios.length} portfolios:`);
        portfolios.forEach(p => {
          console.log(`   - id: ${p.id}, name: ${p.fullName}, updatedAt: ${p.updatedAt}`);
        });

        // Keep the FIRST one (highest id, most recent) and delete the rest
        const keepId = portfolios[0].id;
        const deleteIds = portfolios.slice(1).map(p => p.id);

        console.log(`   ✅ Keeping id: ${keepId}`);
        console.log(`   🗑️  Deleting ids: ${deleteIds.join(', ')}`);

        await Portfolio.destroy({ where: { id: deleteIds } });
        deletedCount += deleteIds.length;
      } else {
        console.log(`✅ userId ${userId}: 1 portfolio (id: ${portfolios[0].id}) — OK`);
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate rows.`);

    // Show final state
    const remaining = await Portfolio.findAll();
    console.log(`📊 Remaining portfolios: ${remaining.length}`);
    remaining.forEach(p => {
      console.log(`   - id: ${p.id}, userId: ${p.userId}, name: ${p.fullName}`);
    });

    // Now add UNIQUE index on userId to prevent future duplicates
    try {
      await sequelize.getQueryInterface().addIndex('portfolios', ['userId'], {
        unique: true,
        name: 'unique_userId_index'
      });
      console.log('\n✅ UNIQUE index added on userId column — no more duplicates possible!');
    } catch (indexErr) {
      if (indexErr.message.includes('Duplicate') || indexErr.name === 'SequelizeUniqueConstraintError') {
        console.log('\n⚠️  Could not add UNIQUE index (still duplicates?). Try running again.');
      } else if (indexErr.message.includes('exists')) {
        console.log('\n✅ UNIQUE index already exists on userId column');
      } else {
        console.log('\n⚠️  Index creation note:', indexErr.message);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup error:', err);
    process.exit(1);
  }
}

cleanup();
