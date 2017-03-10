/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/


/**
 * This StorageManager maintains the mapping between Messaging node Clients & allocated Hyperty Addresses.
 * This StorageManager is based on Redis Persistance, Even though Redis is an in-memory key-value store,
* it persists data to the disk
 **/


class MNPersistManager {

  /**
   * "Private" constructor for the MNManager.
   * @param domain {String} ... the Domain that the StorageManager is responsible for
   * @param storage chosen for i.e Redis persitance, node-persist,etc ...
   **/
   constructor(name, domain, registry, storage) {

     if(!domain) throw new Error('The domain is a needed parameter');
     if(!storage) throw new Error('The storage is a needed parameter');
     if(!registry) throw new Error('The registry is a needed parameter');

     this.domain = domain;
     this.name = name;
     this.logger = registry.getLogger();

     if(storage) {
       this.storage = storage;
     }
   }

   getName() {
     return this.name;
   }


  //************************ STORAGE Manipulations *******************************************
  // stores a (key,value)
   setData(key, value) {

        this.logger.info('[StorageManager], storing ( key =', key +',value =', value+')') ;

        this.storage.set(key, value, function(error, response) {
          if (err){
            this.logger.error('[StorageManager], Error: ', err, ' happened while storing (key,value): ', (key, value));
            throw err;
          }
          this.logger.info('[StorageManager], stored key and value succesful!', response);
        });
    }

   getData(key) {

     this.logger.info('[StorageManager], getting ( value ?, for key =', key) ;
     let _this = this;

     return this.storage.get(key, function(err, response) {
       if (err){
         this.logger.error('[StorageManager], Error: ', reason, ' happened while getting value?, for key: ', key);
         throw err;
       }
       this.logger.info('[StorageManager], got value: ', value + ', for key:', key);
     });
   }

   delData(key) {
     let _this = this;
     this.logger.info('[StorageManager], deleting an entry (key, value) for a given key: ', key);

     this.storage.del(key, function(err, response) {
       if (err){
          _this.logger.error('[StorageManager], Error: ', reason, ' happened while deleting en try for key: ', key);
         throw err;
        }
        _this.logger.info('[StorageManager], deleted entry for key:', key);
      });
    }

   restoreData() {
     let _this =this;

     return new Promise( (resolve, reject) => {
       let count = 0;
       this.storage.forEach((address, runtimeURLs) => {
         _this.logger.info('[StorageManager], mapping keys to values e.g: (addresses, to runtimeURLS) succesful!', address, runtimeURLS);
         count++;
       });
       this.logger.info('[StorageManager], restored %s Subscriptions from MsgNode Persistence Storage', count);
       resolve();
     }).catch((reason) => {
       _this.logger.error('[StorageManager], Error: ', reason, ' happened while restoreSubscriptions %s : ', count);
       reject(reason)
     });
   }
}
module.exports = MNPersistManager;
