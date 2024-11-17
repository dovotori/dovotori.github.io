export class IndexedDb {
  constructor(dbName, tableName) {
    this.db = null;
    this.dbName = dbName;
    this.objectStoreName = tableName;
    this.alreadyExist = false;
  }

  deleteDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(this.dbName);

      request.onerror = (event) => {
        reject(event);
      };

      request.onsuccess = (event) => {
        resolve(event.result); // should be undefined
      };
    });
  }

  setup() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName);

      request.onerror = (e) => {
        reject(e);
      };

      // cal on first creation and also when upgrading db version
      // before onsucess
      request.onupgradeneeded = (e) => {
        this.db = e.target.result;

        const objectStore = this.db.createObjectStore(this.objectStoreName, {
          keyPath: "meshIdIndex",
        });

        // Create an index to search by meshIdIndex.
        objectStore.createIndex("meshIdIndex", "meshIdIndex", {
          unique: true,
        });
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        if (this.db.objectStoreNames.contains(this.objectStoreName)) {
          this.alreadyExist = true;
        }
        resolve();
      };
    });
  }

  upsertData(data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("db is not yet defined.");
      }
      const transaction = this.db.transaction(
        [this.objectStoreName],
        "readwrite"
      );

      transaction.oncomplete = (event) => {
        resolve(event);
      };

      transaction.onerror = (event) => {
        reject(event);
      };

      const objectStore = transaction.objectStore(this.objectStoreName);
      data.forEach((d) => {
        const request = objectStore.put(d);
        request.onsuccess = () => {};
        request.onerror = (event) => {
          reject(event);
        };
      });
    });
  }

  getData(faceId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.objectStoreName]); // read only
      const objectStore = transaction.objectStore(this.objectStoreName);
      const request = objectStore.get(faceId);
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = (e) => {
        resolve(request.result);
      };
    });
  }

  isStoreExist() {
    return this.alreadyExist;
  }
}
