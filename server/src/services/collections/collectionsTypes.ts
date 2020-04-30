import { BaseCollection } from "./firebase/dal/baseCollection";
import { Images } from "./firebase/dal/images";
import { AutomaticAlgorithms } from "./firebase/dal/automatic-algorithms";
import { Experiments } from "./firebase/dal/experiments";
import { TestPlans } from "./firebase/dal/testPlan";

export interface Collections{
    automaticAlgos: () => AutomaticAlgorithms;
    images: () => Images;
    experiments: () => Experiments;
    testPlans: () => TestPlans;
}
