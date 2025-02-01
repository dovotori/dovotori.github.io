import { IndexedDb } from '../lib/indexeddb';

export class GltfDb {
  constructor() {
    this.dbName = 'gltf';
    this.db = new IndexedDb(this.dbName);
  }

  async setup() {
    await this.db.setup([
      {
        name: 'faces',
        keyPath: 'meshIdIndex',
        unique: true,
      },
      {
        name: 'matrices',
        keyPath: 'meshId',
        unique: true,
      },
    ]);
  }

  async addFacesData(data) {
    await this.db.upsertData('faces', data);
  }

  async addNodeMatricesData(data) {
    await this.db.upsertData('matrices', data);
  }

  async getMeshFaceData(faceId) {
    return this.db.getData('faces', faceId);
  }

  async getMeshMatrixData(meshId) {
    return this.db.getData('matrices', meshId);
  }

  isStoreFacesExist() {
    return this.db.isStoreExist('faces');
  }

  isStoreNodeMatricesExist() {
    return this.db.isStoreExist('matrices');
  }
}
