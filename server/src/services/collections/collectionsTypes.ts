import { AutomaticAlgorithms } from "./firebase/dal/automatic-algorithms";
import { Images } from "./firebase/dal/images";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms;
    images: Images;
}