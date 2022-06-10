let db;
const request = indexedDB.open("budget", 1)                     // indexedDB req for a 'budget' database

request.onupgradeneeded = function(event) {
  const db = event.target.result;                               // create object store called "pending" set autoIncrement to true
  db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine){                                        // if app is online, check the database
    checkDatabase();
  }
};

request.onerror = function(event) {
  const transaction = db.transaction(["pending"], "readwrite"); // create a transaction to our indexDB
  const store = transaction.objectStore("pending");             // access indexDB
  store.add(record);                                            // add record to store
}