import { AutomaticAlgorithms } from "./firebase/dal/automatic-algorithms";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms
}