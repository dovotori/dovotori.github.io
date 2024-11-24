export class IndexedDb {
  constructor(dbName) {
    this.db = null;
    this.dbName = dbName;
    this.objectStoreAlreadyExist = {};
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

  setup(tables) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName);

      request.onerror = (e) => {
        reject(e);
      };

      // cal on first creation and also when upgrading db version
      // before onsucess
      request.onupgradeneeded = (e) => {
        this.db = e.target.result;

        tables.forEach((table) => {
          const objectStore = this.db.createObjectStore(table.name, {
            keyPath: table.keyPath,
          });

          // Create an index to search by meshIdIndex.
          objectStore.createIndex(table.keyPath, table.keyPath, {
            unique: table.unique,
          });
        });
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;

        tables.forEach((table) => {
          if (this.db.objectStoreNames.contains(table.name)) {
            this.objectStoreAlreadyExist[table.name] = true;
          }
        });

        resolve();
      };
    });
  }

  upsertData(objectStoreName, data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("db is not yet defined.");
      }
      console.log({ objectStoreName, data });
      const transaction = this.db.transaction([objectStoreName], "readwrite");

      transaction.oncomplete = (event) => {
        resolve(event);
      };

      transaction.onerror = (event) => {
        reject(event);
      };

      const objectStore = transaction.objectStore(objectStoreName);
      data.forEach((d) => {
        const request = objectStore.put(d);
        request.onsuccess = () => {};
        request.onerror = (event) => {
          reject(event);
        };
      });
    });
  }

  getData(objectStoreName, keyPath) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([objectStoreName]); // read only
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.get(keyPath);
      request.onerror = (e) => {
        reject(e);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  isStoreExist(objectStoreName) {
    return this.objectStoreAlreadyExist[objectStoreName] ?? false;
  }
}
