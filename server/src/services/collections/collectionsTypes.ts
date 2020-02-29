import { BaseCollection } from "./firebase/dal/baseCollection";
import { Images } from "./firebase/dal/images";
import { AutomaticAlgorithms } from "./firebase/dal/automatic-algorithms";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms;
    images: () => Images;
}
