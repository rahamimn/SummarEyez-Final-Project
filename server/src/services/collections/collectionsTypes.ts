import { BaseCollection } from "./firebase/dal/baseCollection";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms;
    images: () => Images;
}


export interface Images extends BaseCollection {

}

export interface AutomaticAlgorithms extends BaseCollection{
    
}

export interface Experiments extends BaseCollection {
    
}