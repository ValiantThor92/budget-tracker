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
  const transaction = db.transaction(["pending"], "readwrite"); // create a transaction to indexDB
  const store = transaction.objectStore("pending");             // access indexDB
  store.add(record);                                            // add record
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite"); // create a transaction to indexDB
  const store = transaction.objectStore("pending");             // access indexDB
  store.add(record);                                            // add record
};

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite"); // create a transaction to indexDB
  const store = transaction.objectStore("pending");             // access indexDB
  const getAll = store.getAll();                                // use getAll() methot to retrieve all records
  getAll.onsuccess = function() {                               // POST req to bulk add all transactions in indexDB to the database
    if(getAll.result.length > 0){                               // if results are less than 0 
      fetch("/api/transaction/bulk", {                          // fetch and post in json format
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          accept: "application/json, text/plain, */*",
          "content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {                                                   // if successful 
        const transaction = db.transaction(["pending"], "readwrite"); // create a transaction to indexDB
        const store = transaction.objectStore("pending");             // access indexDB
        store.clear();                                                // clear all items
      });
    }
  };
};

window.addEventListener("online", checkDatabase);                     // event listener for when app comes back online