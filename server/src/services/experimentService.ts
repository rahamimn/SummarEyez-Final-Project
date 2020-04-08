import { SentTable } from './collections/firebase/dal/sentTables';
import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";
import { PythonScriptInterface } from "./pythonScripts/pythonScriptsTypes";
const forEP = require('foreach-promise');
//@ts-ignore
import {promises as fs} from 'fs';
import * as csvToJson from 'csvtojson';

const response = (status,{data=null, error=null}) => ({status, data, error});
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

    //precondition: experiment metadata exists.
    private getSentTableFile = async (experiment, type, name) => {
        let path;

        if(type === 'auto'){
            const autoSentTable = await this.collectionsService.images().sentTablesOf(experiment.imageName).get(name);
            if(!autoSentTable){
                return null;
            }
            path = autoSentTable.path;
        }

        if(type === 'merged'){
            const mergedSentTable = await this.collectionsService.experiments().mergedSentOf(experiment.name).get(name);
            if(!mergedSentTable){
                return null;
            }
            path = mergedSentTable.path;
        }
        
        return await this.storageService.downloadToBuffer(path);
    }

    getSummary = async (experimentName, type, name) => {
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return response(-1, {error:'experiment name does not exist'})
        }

        const csvFile = await this.getSentTableFile(experiment, type, name);
        if(!csvFile){
            return response(-2, {error:'summary does not exist'})
        }

        return response(0, {
            data: await csvToJson({delimiter:'auto'}).fromString(csvFile.toString())
        });
    }

    getSummaries = async (experimentName)=> {
        const eyesExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        const experiment = await this.collectionsService.experiments().get(experimentName);
        if(!experiment){
            return {
                status: -1,
                error: 'experiment name does not exist'
            }
        }

        const autoSentTables = await this.collectionsService.images().sentTablesOf(experiment.imageName).getAll();
        const allAutomaticAlgs = await this.collectionsService.automaticAlgos().getAll();
        const allMergedTables = await this.collectionsService.experiments().mergedSentOf(experimentName).getAll();

        return{
            status: 0,
            data: {
                auto: this.intersectAutomaticAlgs(allAutomaticAlgs, autoSentTables),
                eyes: Array(15).fill(eyesExample),
                merged: allMergedTables,
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
    
    public getSummaryForMerge = async (experimentName, type, name_of_sammary) => {
        const experiment_ = await this.collectionsService.experiments().get(experimentName);

        if(!experiment_){
            return {
                status: -1,
                error: 'experiment name does not exist'
            }
        }

        if(type === 'auto'){
            const autoSentTable = await this.collectionsService.images().sentTablesOf(experiment_.imageName).get(name_of_sammary);
            if(!autoSentTable){
                return {
                    status: -2,
                    error: 'auto summary name does not exist'
                }
            }

            else {
                const SentTable_ = await this.storageService.downloadToBuffer(autoSentTable.path)
                return {
                    status: 0,
                    data:  SentTable_ 
                }
            }
        }

        //need to add handler for merge and eyes
        if(type === 'merged'){
            try {
            const mergedSentTable = await this.storageService.downloadToBuffer(`experiments/${experimentName}/merged-sent/${name_of_sammary}`)

            if(!mergedSentTable){
                return {
                    status: -3,
                    error: 'merged summary name does not exist'
                }
            }

            else {
                // const SentTable_ = await this.storageService.downloadToBuffer(mergedSentTable.path)
                return {
                    status: 0,
                    data:  mergedSentTable 
                }
            }
        }
        catch(error){
            return {
                status: -3,
                error: 'merged summary name does not exist'
            }
        }
        }


        if(type === 'eyes'){
            const eyesSentTable = await this.collectionsService.images().sentTablesOf(experiment_.imageName).get(name_of_sammary);
            if(!eyesSentTable){
                return {
                    status: -4,
                    error: 'eyes summary name does not exist'
                }
            }

            else {
                const SentTable_ = await this.storageService.downloadToBuffer(eyesSentTable.path)
                return {
                    status: 0,
                    data:  SentTable_ 
                }
            }
        }
    }


    merge_algorithms = async(experimentName, mergedName, sammaries_details ) =>{

        var percents = sammaries_details.map(sammary => sammary.percentage)
        var names = sammaries_details.map(sammary => sammary.name)

        var types = sammaries_details.map(sammary => sammary.type)        
        const expirament_ = await this.collectionsService.experiments().get(experimentName)
        if(!expirament_)
        {
            return {status: -1, error: "The name of the experiment does not exist in the system."};  
        }   

        const experiment = await this.collectionsService.experiments().get(experimentName)


        const imageName =  experiment.imageName;
        const image = await this.collectionsService.images().get(imageName)
        const base_sent_table = await this.storageService.downloadToBuffer(image.base_sent_table_path);

        const {status, data: sent_tables}  = await this.sent_table_initializer(names,types, experimentName);
        if(status!==0){
            return {
                status: -1,
                error: "the sammaries name is not found"
            };
        }
        try {
        var {merged_table} = await this.pythonService.mergeTables(percents, sent_tables ,base_sent_table )  

        
        const path = `experiments/${experimentName}/merged-sent/${mergedName}`
        await this.storageService.uploadBuffer(path, merged_table, fileTypes.Csv);
        await this.collectionsService.experiments().mergedSentOf(experimentName).add(mergedName,{
            type: 'merged',
            name: mergedName,
            mergedInput : sammaries_details,
            path,
            creation_date: Date.now()
        });


        return {
            status: 0,
            data: await csvToJson({delimiter:'auto'}).fromString(merged_table.toString())
        };
    }
    catch(error){
        return {
            status: -2,
            error: "there was a problem with the python"
        };
    }
    } 


    public async sent_table_initializer(names: string[],types: string [], experimentName: string) {
        const sent_tables = []
        for(var i=0; i<names.length; i++){
            var element = names[i]
            var new_sent_table = await this.getSummaryForMerge(experimentName, types[i], element);
            if (new_sent_table.status != 0) {
                return {
                    status: -1,
                    error: "the sammary name is not found"
                };
            }
            //the sammary name is found
            else {
                await sent_tables.push(new_sent_table.data);
            }
        }
 
        return {
            status: 0,
            data:sent_tables
        };
    }
}