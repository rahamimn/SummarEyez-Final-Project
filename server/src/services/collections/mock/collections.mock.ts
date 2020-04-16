import { AutomaticAlgorithmsMock } from "./dal/automatic-algorithms.mock";
import { ImagesMock } from "./dal/images.mock";
import { ExperimentsMock } from "./dal/experiments.mock";
import { Collections } from "../collectionsTypes";
import { QuesionsMock } from "./dal/questions.mock";

export class CollectionMock implements Collections {
    private _automaticAlgos: AutomaticAlgorithmsMock;
    private _images: ImagesMock;
    private _experiments: ExperimentsMock;
    private _questions: QuesionsMock;

    constructor(){
        this._automaticAlgos = new AutomaticAlgorithmsMock({});
        this._images = new ImagesMock({});
        this._experiments = new ExperimentsMock({});
    }
    automaticAlgos = () => this._automaticAlgos;
    images = () => this._images;
    experiments = () => this._experiments;
    questions = () => this._questions;
    createBatch = () => {}// should impl
}