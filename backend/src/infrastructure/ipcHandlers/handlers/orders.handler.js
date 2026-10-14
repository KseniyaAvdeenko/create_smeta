const { requireAuth } = require('../helpers/auth.helper');
const { handleIpc } = require('../helpers/serialize.helper');

function registerOrderHandlers({
  authService,
  orderRepo,
  orderWorksRepo,
  orderWorkQuantityRepo,
  savedFilesRepo,
}) {
  handleIpc('orders:getAll', async () => {
    const user = requireAuth(authService);
    return orderRepo.getAllByUserId(user.id);
  });

  handleIpc('orders:getByIdWithDetails', async (_, id) => {
    requireAuth(authService);
    return orderRepo.getOrderWithDetails(id);
  });

  handleIpc('orders:create', async (_, orderData) => {
    const user = requireAuth(authService);
    return orderRepo.createWithCatalog({ ...orderData, createdBy: user.id });
  });

  handleIpc('orders:update', async (_, id, updateData) => {
    requireAuth(authService);
    return orderRepo.update(id, updateData);
  });

  handleIpc('orders:delete', async (_, id) => {
    requireAuth(authService);
    return orderRepo.delete(id);
  });

  handleIpc('orderWorks:getAll', async () => {
    requireAuth(authService);
    return orderWorksRepo.getAll();
  });

  handleIpc('orderWorks:getAllByOrderId', async (_, orderId) => {
    requireAuth(authService);
    return orderWorksRepo.getByOrderId(orderId);
  });

  handleIpc('orderWorks:getById', async (_, id) => {
    requireAuth(authService);
    return orderWorksRepo.getById(id);
  });

  handleIpc('orderWorks:create', async (_, orderWorkData) => {
    requireAuth(authService);
    return orderWorksRepo.create(orderWorkData);
  });

  handleIpc('orderWorks:update', async (_, id, updateData) => {
    requireAuth(authService);
    return orderWorksRepo.update(id, updateData);
  });

  handleIpc('orderWorks:delete', async (_, id) => {
    requireAuth(authService);
    return orderWorksRepo.delete(id);
  });

  handleIpc('orderWorkQuantity:getByOrderWorkId', async (_, orderWorkId) => {
    requireAuth(authService);
    return orderWorkQuantityRepo.getByOrderWorkId(orderWorkId);
  });

  handleIpc('orderWorkQuantity:create', async (_, data) => {
    requireAuth(authService);
    return orderWorkQuantityRepo.create(data);
  });

  handleIpc('orderWorkQuantity:update', async (_, id, data) => {
    requireAuth(authService);
    return orderWorkQuantityRepo.update(id, data);
  });

  handleIpc('orderWorkQuantity:delete', async (_, id) => {
    requireAuth(authService);
    return orderWorkQuantityRepo.delete(id);
  });

  handleIpc('savedFile:getAll', async () => {
    const user = requireAuth(authService);
    return savedFilesRepo.getAllByUserId(user.id);
  });

  handleIpc('savedFile:getByOrderId', async (_, orderId) => {
    requireAuth(authService);
    return savedFilesRepo.getByOrderId(orderId);
  });

  handleIpc('savedFile:getById', async (_, id) => {
    requireAuth(authService);
    return savedFilesRepo.getById(id);
  });

  handleIpc('savedFile:generate', async (_, order, orderWorks) => {
    const user = requireAuth(authService);
    return savedFilesRepo.generate(order, orderWorks, user.id);
  });

  handleIpc('savedFile:remove', async (_, id) => {
    const user = requireAuth(authService);
    return savedFilesRepo.remove(id, user.id);
  });
}

module.exports = registerOrderHandlers;
