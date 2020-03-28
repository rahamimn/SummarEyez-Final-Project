import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";
import { PythonScriptInterface } from "./pythonScripts/pythonScriptsTypes";
const forEP = require('foreach-promise');
//@ts-ignore
import {promises as fs} from 'fs';
import * as csvToJson from 'csvtojson';


export class ExperimentService{
    private collectionsService : Collections;
    private storageService: Storage;
    private pythonService: PythonScriptInterface;

    constructor({collectionsService,storageService,pythonService}){
        this.collectionsService = collectionsService;
        this.storageService = storageService;
        this.pythonService = pythonService;
    }

    private intersectAutomaticAlgs(all:{id:string, data:object, disabled?: boolean}[] ,subset: {id:string, data:object}[]){
        const autoAlgs = [];
        all.forEach(auto => {
            const autoCalculated = subset.filter(auto2 => auto2.id === auto.id);

            if(autoCalculated.length === 0){
                autoAlgs.push({...auto, disabled: true})
            }
            else{
                autoAlgs.push({id:auto.id,data:{...auto.data, ...autoCalculated[0].data} , disabled: false})
            }
        });
        return autoAlgs;
    }

    private addAutomaticAlgToImg = async (tables, imageName) => {
        await forEP(tables, async row => {
            const path = `images/${imageName}/algs/${row.name}`;
            await this.storageService.uploadBuffer(path, row.sent_table, fileTypes.Csv);
            await this.collectionsService.images().sentTablesOf(imageName).add(row.name,{
                type: 'auto',
                name: row.name,
                path,
                creation_date: Date.now()
            });
        });
    }
    private getAutoAlgsSavedLocally = async () => {
        const files = await fs.readdir('./automatic-algorithms');
        let algNames = [];
        if(files.length > 0){
            await forEP(files, async (file:string) => {
                if(file.endsWith('.py')){
                    algNames.push(file);
                }
            });
        }
        return algNames;
    }

    addImage = async (name, buffer) => {
        const image = await this.collectionsService.images().get(name);
        if(image){
            return {
                status: -1,
                error: 'image name already exists'
            }
        }

        const files = await this.pythonService.processImage(buffer)
        await this.storageService.uploadBuffer(`images/${name}/image`, buffer, fileTypes.Image);
        await this.storageService.uploadBuffer(`images/${name}/text`, files.text, fileTypes.Text);
        await this.storageService.uploadBuffer(`images/${name}/word_ocr`, files.word_ocr, fileTypes.Csv);
        await this.storageService.uploadBuffer(`images/${name}/base_sent_table`, files.base_sent_table, fileTypes.Csv);
        await this.collectionsService.images().add(name,{
            name,
            uploaded_date: Date.now(),
            image_path: `images/${name}/image`,
            text_path: `images/${name}/text`,
            word_ocr_path: `images/${name}/word_ocr`,
            base_sent_table_path: `images/${name}/base_sent_table`,
        });

        const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally();
        //we should fetch newly algorithms 
        const allAutomaticAlgs: string[] = await this.collectionsService.automaticAlgos().getAll();
        if(allAutomaticAlgs.length > 0){
            await forEP(allAutomaticAlgs, async (metaAuto) => {
                const autoName = metaAuto.data.name;
                if(allAutomaticAlgs.includes(autoName)){
                    return;
                }
                await this.storageService.downloadToPath(
                    metaAuto.data.path,
                    `./automatic-algorithms/${autoName}`
                )
                automaticAlgsSavedLocally.push(autoName)
            });
        }
    
        const {tables} = await this.pythonService.runAutomaticAlgs(
            automaticAlgsSavedLocally,
            files.text,
            files.base_sent_table);
        await this.addAutomaticAlgToImg(tables,name);

        return {
            status: 0
        }     
    }

    getImages = async () => {
        const imagesCollection = await this.collectionsService.images();
        const images  = await imagesCollection.getAll();

        return images;
    }

    getExperiments = async () => {
        const experiments = await this.collectionsService.experiments().getAll();
        return { status: 0, experiments};
    }

    getSummary = async (experimentName, type, name) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return {
                status: -1,
                error: 'experiment name does not exist'
            }
        }

        if(type === 'auto'){
            const autoSentTable = await this.collectionsService.images().sentTablesOf(experiment.imageName).get(name);
            if(!autoSentTable){
                return {
                    status: -2,
                    error: 'summary name does not exist'
                }
            }
            const csvFile = await this.storageService.downloadToBuffer(autoSentTable.path);

            return {
                status: 0,
                data: await csvToJson({delimiter:'auto'}).fromString(csvFile.toString())
            };
        }
    }

    getSummaries = async (experimentName)=> {
        const eyesExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        const mergedExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        //
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return {
                status: -1,
                error: 'experiment name does not exist'
            }
        }

        const autoSentTables = await this.collectionsService.images().sentTablesOf(experiment.imageName).getAll();
        const allAutomaticAlgs = await this.collectionsService.automaticAlgos().getAll();

        return{
            status: 0,
            data: {
                auto: this.intersectAutomaticAlgs(allAutomaticAlgs, autoSentTables),
                eyes: Array(15).fill(eyesExample),
                merged: Array(15).fill(mergedExample),
            }
        }

    }

    //TODO - check if exists download if needed
    // we could check with in memory data
    private verifyAutomaticAlgorithmExists = async (names: string[]) => {
        const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally();
        //we should fetch newly algorithms 
        await forEP(names, async name => {
            const metaAuto = await this.collectionsService.automaticAlgos().get(name);
            if(!automaticAlgsSavedLocally.includes(name)){
                await this.storageService.downloadToPath(
                    metaAuto.path,
                    `./automatic-algorithms/${name}`
                )
            }
        });
    };

    runAutomaticAlgs = async (algsNames: string[], experimentName:string ) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return {
                status: -1,
                error: 'experiment name does not exist'
            }
        };
        const imageName =  experiment.imageName;
        const text = await this.storageService.downloadToBuffer(`images/${imageName}/text`);
        const base_sent_table = await this.storageService.downloadToBuffer(`images/${imageName}/base_sent_table`);
        await this.verifyAutomaticAlgorithmExists(algsNames);
        const {tables} = await this.pythonService.runAutomaticAlgs(algsNames, text,base_sent_table);
        await this.addAutomaticAlgToImg(tables,imageName);
        return {
            status: 0,
        }
    }

    addAutomaticAlgorithms = async (name: string, buffer) => {
        const formattedName = name.endsWith('.py') ? name :  (name+'.py');
        const path = `automatic-algos/${formattedName}`
        await this.storageService.uploadBuffer(path, buffer, fileTypes.Text);
        if (await this.collectionsService.automaticAlgos().get(formattedName) != undefined){
            return {status: -1, error: "the name of the file is not unique"};
        }
        else{
        await this.collectionsService.automaticAlgos().add(formattedName,{
            name: formattedName,
            path,
            uploaded_date: Date.now()
        });
            return {status: 0};
        }
    };

    addExperiment = async (experimentName, imageName)=>{
       if(await this.collectionsService.experiments().get(experimentName)){
        return {status: -1, error: "The name of the experiment already exist in the system."};  
       }
       await this.collectionsService.experiments().add(experimentName,
         {name: experimentName, imageName});
       return {status: 0};
    }
    

}