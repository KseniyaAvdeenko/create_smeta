const defaultCatalog = require('./defaultCatalog.json');

const UNIT_TO_SHORT = {
  m2: 'м²',
  mp: 'м. п.',
};

function catalogWorkKey(category, name) {
  return `${category}::${name}`;
}

async function seedDefaultMeasurements(models) {
  const count = await models.measurement.count();
  if (count > 0) return;

  await models.measurement.bulkCreate(defaultCatalog.measurements);
}

async function getMeasurementMap(models) {
  await seedDefaultMeasurements(models);
  const measurements = await models.measurement.findAll();
  return new Map(measurements.map((m) => [m.shortName, m.id]));
}

async function ensureCategoryMap(models, userId) {
  const existing = await models.work_category.findAll({ where: { userId } });
  const categoryIds = new Map(existing.map((c) => [c.name, c.id]));

  for (const name of defaultCatalog.categories) {
    if (categoryIds.has(name)) continue;
    const category = await models.work_category.create({ name, userId });
    categoryIds.set(name, category.id);
  }

  return categoryIds;
}

async function createWorkWithPrices(models, item, categoryId, userId, byShortName) {
  const work = await models.work.create({
    name: item.name,
    categoryId,
    userId,
  });

  await attachPrices(models, work.id, item.prices, byShortName);
  return work;
}

async function attachPrices(models, workId, prices, byShortName) {
  for (const price of prices) {
    const measurementId = byShortName.get(UNIT_TO_SHORT[price.unit]);
    if (!measurementId) continue;

    await models.work_measurement.create({
      workId,
      measurementId,
      cost: price.cost,
    });
  }
}

async function backfillWorkMeasurements(models, userId, byShortName) {
  const pricesByKey = new Map(
    defaultCatalog.works.map((item) => [catalogWorkKey(item.category, item.name), item.prices]),
  );

  const works = await models.work.findAll({
    where: { userId },
    include: [{ model: models.work_category, as: 'category' }],
  });

  for (const work of works) {
    const priceCount = await models.work_measurement.count({ where: { workId: work.id } });
    if (priceCount > 0) continue;

    const prices = pricesByKey.get(catalogWorkKey(work.category?.name, work.name));
    if (!prices?.length) continue;

    await attachPrices(models, work.id, prices, byShortName);
  }
}

async function seedUserCatalog(models, userId) {
  const byShortName = await getMeasurementMap(models);
  const categoryIds = await ensureCategoryMap(models, userId);

  const workCount = await models.work.count({ where: { userId } });

  if (workCount === 0) {
    for (const item of defaultCatalog.works) {
      const categoryId = categoryIds.get(item.category);
      if (!categoryId) continue;
      await createWorkWithPrices(models, item, categoryId, userId, byShortName);
    }
  } else {
    await backfillWorkMeasurements(models, userId, byShortName);
  }
}

async function runCatalogSeed(models, userId = null) {
  await seedDefaultMeasurements(models);
  if (userId) {
    await seedUserCatalog(models, userId);
  }
}

module.exports = {
  runCatalogSeed,
  seedDefaultMeasurements,
  seedUserCatalog,
};
