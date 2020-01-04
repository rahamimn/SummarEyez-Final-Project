import googleStorage from './googleStorage/googleStorage';
import localStorage from './localStorage/localStorage';
import storageMock from './mock/storage.mock';
export interface Storage{

}


const storages: Storage = [googleStorage, localStorage, storageMock ];


export default storages[0];

