import { BaseCollection } from "./firebase/dal/baseCollection";
import { Images } from "./firebase/dal/images";
import { AutomaticAlgorithms } from "./firebase/dal/automatic-algorithms";
import { Experiments } from "./firebase/dal/experiments";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms;
    images: () => Images;
    experiments: () => Experiments;
}
