import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";


export class ExperimentService{
    private collectionsService : Collections;
    private storageService: Storage;
    private pythonService;

    constructor({collectionsService,storageService,pythonService}){
        this.collectionsService = collectionsService;
        this.storageService = storageService;
        this.pythonService = pythonService;
    }

    addAutomaticAlgorithms = async (name, buffer) => {
        const url = `automatic-algos/${name}`
        await this.storageService.uploadBuffer(`automatic-algos/${name}`, buffer, fileTypes.Text);
        await this.collectionsService.automaticAlgos().add(name,{
            name,
            url,
        });
    }
    

}