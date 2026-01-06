const FirebaseArrayDocRepository = require('./baseArrayDoc.repository');
const FirebaseOrderWorkRepository = require('./orderWork.repository');
const FirebaseSavedFileRepository = require('./savedFile.repository');
const {db} = require('../../db/firebase/firebase.client');

/**
 * smetaOrders / orders
 * data: [ { id, name, client, date, ... } ]
 * item: {id: int, name: str, client: str, date: str}
 * Для удобства здесь же есть метод получения заказа с работами и файлами.
 */
class FirebaseOrderRepository extends FirebaseArrayDocRepository {
    constructor(firestoreDb = db) {
        super(firestoreDb, 'SmetaOrders', 'Orders', 'id');
        this.orderWorkRepo = new FirebaseOrderWorkRepository(firestoreDb);
        this.savedFileRepo = new FirebaseSavedFileRepository(firestoreDb);
    }

    async getOrderWithDetails(orderId) {
        const order = await this.getById(orderId);
        if (!order) return null;

        const [orderWorks, orderFiles] = await Promise.all([
            this.orderWorkRepo.getByOrderId(orderId),
            this.savedFileRepo.getByOrderId(orderId),
        ]);

        return {
            ...order,
            orderWorks,
            orderFiles,
        };
    }

    async delete(orderId) {
        try {
            const order = await this.getById(orderId);
            if (!order) return 0;

            const [orderWorks, savedFiles] = await Promise.all([
                this.orderWorkRepo.getByOrderId(orderId),
                this.savedFileRepo.getByOrderId(orderId),
            ]);

            for (const work of orderWorks) {
                await this.orderWorkRepo.delete(work.id);
            }

            for (const file of savedFiles) {
                await this.savedFileRepo.remove(file.id);
            }

            await super.delete(orderId);
            return 1
        } catch (e) {
            console.error(e)
            return 0
        }
    }
}

module.exports = FirebaseOrderRepository;


