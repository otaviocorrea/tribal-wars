const TribalWarsSDK = {
  game_data: game_data,
  player: game_data.player,
  village: game_data.village,
  world: game_data.world,
  locale: game_data.locale,
  market: game_data.market,
  current: {
    player: game_data.player,
    village: game_data.village,
  },
  credentials: btoa(JSON.stringify(game_data)),
  signature: btoa(JSON.stringify(`<html>${document.querySelector('html').innerHTML}</html>`)),
  ui: {
    startTooltips: () => {
      UI.ToolTip("[title]")
    },
    infoMessage: (text, duration = null) => {
      UI.InfoMessage(text, duration)
    },
    successMessage: (text, duration = null) => {
      UI.SuccessMessage(text, duration)
    },
    errorMessage: (text, duration = null) => {
      UI.ErrorMessage(text, duration)
    }
  },
  tabStorage: {
    set: (key, value, w = window) => {
      w.sessionStorage.setItem(key, JSON.stringify(value))
    },
    get: (key, defaultValue = null, w = window) => {
      let item = w.sessionStorage.getItem(key)
      if (!item) return defaultValue
      return JSON.parse(item)
    }
  },
  storage: {
    set: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    get: (key, defaultValue = null) => {
      let item = localStorage.getItem(key)
      if (!item) return defaultValue
      return JSON.parse(item)
    }
  },
  suportDb: ('indexedDB' in window),
  db: (dbName, dbVersion, storeName) => {
    return new IndexDBTools(dbName, dbVersion, storeName)
  }
}

// This piece of code allows you to globally provide the Tribal Wars SDK 
// variable for your entire window, even when initially required by Tampermonkey
//
// Don't remove it, just accept it. It's working LOL
try {
  unsafeWindow.TribalWarsSDK = TribalWarsSDK
} catch (e) {
  window.TribalWarsSDK = TribalWarsSDK
}

class IndexDBTools {
  constructor(dbName, dbVersion, storeName) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
    this.db = null;
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      var request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = function (event) {
        reject("Erro ao abrir o banco de dados.");
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve("Banco de dados aberto com sucesso.");
      };

      request.onupgradeneeded = (event) => {
        var db = event.target.result;
        db.createObjectStore(this.storeName, {
          keyPath: 'id'
        });
        resolve("Banco de dados criado com sucesso.");
      };
    });
  }

  async addOrUpdate(record) {
    await this.openDB();
    var transaction = this.db.transaction([this.storeName], 'readwrite');
    var objectStore = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      var getRequest = objectStore.get(record.id);

      getRequest.onsuccess = (event) => {
        var existingRecord = event.target.result;

        if (existingRecord) {
          // Registro encontrado, atualize-o
          var updatedRecord = {
            ...existingRecord,
            ...record
          };
          var updateRequest = objectStore.put(updatedRecord);

          updateRequest.onsuccess = function (event) {
            resolve("Registro atualizado com sucesso.");
          };

          updateRequest.onerror = function (event) {
            reject("Erro ao atualizar registro.");
          };
        } else {
          // Registro não encontrado, adicione-o
          var addRequest = objectStore.add(record);

          addRequest.onsuccess = function (event) {
            resolve("Registro adicionado com sucesso.");
          };

          addRequest.onerror = function (event) {
            reject("Erro ao adicionar registro.");
          };
        }
      };

      getRequest.onerror = function (event) {
        reject("Erro ao buscar registro.");
      };
    });
  }

  async get(id) {
    await this.openDB();
    var transaction = this.db.transaction([this.storeName], 'readonly');
    var objectStore = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      var getRequest = objectStore.get(id);

      getRequest.onsuccess = function (event) {
        var record = event.target.result;
        resolve(record);

      };

      getRequest.onerror = function (event) {
        reject("Erro ao buscar registro.");
      };
    });
  }

  async getAll() {
    await this.openDB();
    var transaction = this.db.transaction([this.storeName], 'readonly');
    var objectStore = transaction.objectStore(this.storeName);
    var request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = function (event) {
        var records = event.target.result;
        resolve(records);
      };

      request.onerror = function (event) {
        reject("Erro ao recuperar registros.");
      };
    });
  }

  async clearTable() {
    await this.openDB();
    var transaction = this.db.transaction([this.storeName], 'readwrite');
    var objectStore = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      var clearRequest = objectStore.clear();

      clearRequest.onsuccess = function (event) {
        resolve(true);
      };

      clearRequest.onerror = function (event) {
        reject(false);
      };
    });
  }
}
