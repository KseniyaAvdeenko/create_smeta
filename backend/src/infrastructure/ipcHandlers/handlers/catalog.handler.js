const { requireAuth } = require('../helpers/auth.helper');
const { handleIpc } = require('../helpers/serialize.helper');

function registerCatalogHandlers({
  authService,
  measurementRepo,
  workCategoryRepo,
  worksRepo,
  workMeasurementRepo,
}) {
  handleIpc('measurements:getAll', async () => {
    requireAuth(authService);
    return measurementRepo.getAllWithRelations();
  });

  handleIpc('measurements:getById', async (_, id) => {
    requireAuth(authService);
    return measurementRepo.getByIdWithRelations(id);
  });

  handleIpc('measurements:create', async (_, measurementData) => {
    requireAuth(authService);
    return measurementRepo.create(measurementData);
  });

  handleIpc('measurements:update', async (_, id, updateData) => {
    requireAuth(authService);
    return measurementRepo.update(id, updateData);
  });

  handleIpc('measurements:delete', async (_, id) => {
    requireAuth(authService);
    return measurementRepo.delete(id);
  });

  handleIpc('workCategory:getAll', async () => {
    const user = requireAuth(authService);
    return workCategoryRepo.getAllByUserId(user.id);
  });

  handleIpc('workCategory:getById', async (_, id) => {
    requireAuth(authService);
    return workCategoryRepo.getByIdWithWorks(id);
  });

  handleIpc('workCategory:create', async (_, workCategoryData) => {
    const user = requireAuth(authService);
    return workCategoryRepo.create({ ...workCategoryData, userId: user.id });
  });

  handleIpc('workCategory:update', async (_, id, updateData) => {
    requireAuth(authService);
    return workCategoryRepo.update(id, updateData);
  });

  handleIpc('workCategory:delete', async (_, id) => {
    requireAuth(authService);
    return workCategoryRepo.delete(id);
  });

  handleIpc('works:getAll', async () => {
    const user = requireAuth(authService);
    return worksRepo.getAllByUserId(user.id);
  });

  handleIpc('works:getById', async (_, id) => {
    requireAuth(authService);
    return worksRepo.getById(id);
  });

  handleIpc('works:getByCategory', async (_, categoryId) => {
    requireAuth(authService);
    return worksRepo.findByCategory(categoryId);
  });

  handleIpc('works:create', async (_, workData) => {
    const user = requireAuth(authService);
    return worksRepo.create({ ...workData, userId: user.id });
  });

  handleIpc('works:update', async (_, id, updateData) => {
    requireAuth(authService);
    return worksRepo.update(id, updateData);
  });

  handleIpc('works:delete', async (_, id) => {
    requireAuth(authService);
    return worksRepo.delete(id);
  });

  handleIpc('workMeasurements:getByWorkId', async (_, workId) => {
    requireAuth(authService);
    return workMeasurementRepo.getByWorkId(workId);
  });

  handleIpc('workMeasurements:create', async (_, data) => {
    requireAuth(authService);
    return workMeasurementRepo.create(data);
  });

  handleIpc('workMeasurements:update', async (_, id, data) => {
    requireAuth(authService);
    return workMeasurementRepo.update(id, data);
  });

  handleIpc('workMeasurements:delete', async (_, id) => {
    requireAuth(authService);
    return workMeasurementRepo.delete(id);
  });
}

module.exports = registerCatalogHandlers;
