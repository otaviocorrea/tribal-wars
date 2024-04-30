!function(t,n){var r,e;"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(r=t.Base64,(e=n()).noConflict=function(){return t.Base64=r,e},t.Meteor&&(Base64=e),t.Base64=e)}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,(function(){"use strict";var t,n="3.7.7",r=n,e="function"==typeof Buffer,o="function"==typeof TextDecoder?new TextDecoder:void 0,u="function"==typeof TextEncoder?new TextEncoder:void 0,i=Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="),f=(t={},i.forEach((function(n,r){return t[n]=r})),t),c=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,a=String.fromCharCode.bind(String),d="function"==typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):function(t){return new Uint8Array(Array.prototype.slice.call(t,0))},s=function(t){return t.replace(/=/g,"").replace(/[+\/]/g,(function(t){return"+"==t?"-":"_"}))},l=function(t){return t.replace(/[^A-Za-z0-9\+\/]/g,"")},h=function(t){for(var n,r,e,o,u="",f=t.length%3,c=0;c<t.length;){if((r=t.charCodeAt(c++))>255||(e=t.charCodeAt(c++))>255||(o=t.charCodeAt(c++))>255)throw new TypeError("invalid character found");u+=i[(n=r<<16|e<<8|o)>>18&63]+i[n>>12&63]+i[n>>6&63]+i[63&n]}return f?u.slice(0,f-3)+"===".substring(f):u},p="function"==typeof btoa?function(t){return btoa(t)}:e?function(t){return Buffer.from(t,"binary").toString("base64")}:h,y=e?function(t){return Buffer.from(t).toString("base64")}:function(t){for(var n=[],r=0,e=t.length;r<e;r+=4096)n.push(a.apply(null,t.subarray(r,r+4096)));return p(n.join(""))},A=function(t,n){return void 0===n&&(n=!1),n?s(y(t)):y(t)},b=function(t){if(t.length<2)return(n=t.charCodeAt(0))<128?t:n<2048?a(192|n>>>6)+a(128|63&n):a(224|n>>>12&15)+a(128|n>>>6&63)+a(128|63&n);var n=65536+1024*(t.charCodeAt(0)-55296)+(t.charCodeAt(1)-56320);return a(240|n>>>18&7)+a(128|n>>>12&63)+a(128|n>>>6&63)+a(128|63&n)},g=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,B=function(t){return t.replace(g,b)},x=e?function(t){return Buffer.from(t,"utf8").toString("base64")}:u?function(t){return y(u.encode(t))}:function(t){return p(B(t))},C=function(t,n){return void 0===n&&(n=!1),n?s(x(t)):x(t)},m=function(t){return C(t,!0)},v=/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,U=function(t){switch(t.length){case 4:var n=((7&t.charCodeAt(0))<<18|(63&t.charCodeAt(1))<<12|(63&t.charCodeAt(2))<<6|63&t.charCodeAt(3))-65536;return a(55296+(n>>>10))+a(56320+(1023&n));case 3:return a((15&t.charCodeAt(0))<<12|(63&t.charCodeAt(1))<<6|63&t.charCodeAt(2));default:return a((31&t.charCodeAt(0))<<6|63&t.charCodeAt(1))}},F=function(t){return t.replace(v,U)},w=function(t){if(t=t.replace(/\s+/g,""),!c.test(t))throw new TypeError("malformed base64.");t+="==".slice(2-(3&t.length));for(var n,r,e,o="",u=0;u<t.length;)n=f[t.charAt(u++)]<<18|f[t.charAt(u++)]<<12|(r=f[t.charAt(u++)])<<6|(e=f[t.charAt(u++)]),o+=64===r?a(n>>16&255):64===e?a(n>>16&255,n>>8&255):a(n>>16&255,n>>8&255,255&n);return o},S="function"==typeof atob?function(t){return atob(l(t))}:e?function(t){return Buffer.from(t,"base64").toString("binary")}:w,E=e?function(t){return d(Buffer.from(t,"base64"))}:function(t){return d(S(t).split("").map((function(t){return t.charCodeAt(0)})))},D=function(t){return E(z(t))},R=e?function(t){return Buffer.from(t,"base64").toString("utf8")}:o?function(t){return o.decode(E(t))}:function(t){return F(S(t))},z=function(t){return l(t.replace(/[-_]/g,(function(t){return"-"==t?"+":"/"})))},T=function(t){return R(z(t))},Z=function(t){return{value:t,enumerable:!1,writable:!0,configurable:!0}},j=function(){var t=function(t,n){return Object.defineProperty(String.prototype,t,Z(n))};t("fromBase64",(function(){return T(this)})),t("toBase64",(function(t){return C(this,t)})),t("toBase64URI",(function(){return C(this,!0)})),t("toBase64URL",(function(){return C(this,!0)})),t("toUint8Array",(function(){return D(this)}))},I=function(){var t=function(t,n){return Object.defineProperty(Uint8Array.prototype,t,Z(n))};t("toBase64",(function(t){return A(this,t)})),t("toBase64URI",(function(){return A(this,!0)})),t("toBase64URL",(function(){return A(this,!0)}))},O={version:n,VERSION:r,atob:S,atobPolyfill:w,btoa:p,btoaPolyfill:h,fromBase64:T,toBase64:C,encode:C,encodeURI:m,encodeURL:m,utob:B,btou:F,decode:T,isValid:function(t){if("string"!=typeof t)return!1;var n=t.replace(/\s+/g,"").replace(/={0,2}$/,"");return!/[^\s0-9a-zA-Z\+/]/.test(n)||!/[^\s0-9a-zA-Z\-_]/.test(n)},fromUint8Array:A,toUint8Array:D,extendString:j,extendUint8Array:I,extendBuiltins:function(){j(),I()},Base64:{}};return Object.keys(O).forEach((function(t){return O.Base64[t]=O[t]})),O}));

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
  credentials: Base64.encode(JSON.stringify(game_data)),
  signature:  Base64.encode(`<html>${document.querySelector('html').innerHTML}</html>`),
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
  },
  b64: Base64,
  groups: {
    getAll: function() {
      let groups = null
      jQuery.ajax({
        url: `/game.php?village=${game_data.village.id}&screen=groups&mode=overview&ajax=load_group_menu&`,
        success: function (result) {
           groups = result.result
        },
        async: false
      });
      return groups
    },
    set: function(groupId) {
      jQuery.ajax({
        url: `/game.php?village=${game_data.village.id}&screen=overview_villages&mode=combined&group=${groupId}`,
        success: function (result) {
          //nada
        },
        async: false
      });
    },
    get: function(groupId) {
      const currentGroupId = game_data.group_id
      let villages = []
      jQuery.ajax({
        url: `/game.php?village=${game_data.village.id}&screen=overview_villages&mode=combined&group=${groupId}&page=-1&`,
        success: function (result) {
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(result, 'text/html');
          const table = htmlDoc.getElementById('combined_table')
          table.querySelectorAll('.quickedit-vn').forEach(e => {
            const id = e.attributes['data-id'].value
            const name = e.innerText.trim()
            villages.push({id, name})
          })
        },
        async: false
      });
      this.set(currentGroupId)
      return villages
    }
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
