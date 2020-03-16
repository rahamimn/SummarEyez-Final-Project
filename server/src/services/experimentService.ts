import { fileTypes, Storage } from "./storage/storageTypes";
import { Collections } from "./collections/collectionsTypes";
import { PythonScriptInterface } from "./pythonScripts/pythonScriptsTypes";
const forEP = require('foreach-promise');
//@ts-ignore
import {promises as fs} from 'fs';
import * as csv from 'csvtojson';

export class ExperimentService{
    private collectionsService : Collections;
    private storageService: Storage;
    private pythonService: PythonScriptInterface;

    constructor({collectionsService,storageService,pythonService}){
        this.collectionsService = collectionsService;
        this.storageService = storageService;
        this.pythonService = pythonService;
    }

    private addAutomaticAlgToImg = async (tables, imageName) => {
        await forEP(tables, async row => {
            const path = `images/${imageName}/algs/${row.name}`;
            await this.storageService.uploadBuffer(path, row.sent_table, fileTypes.Csv);
            await this.collectionsService.images().sentTablesOf(imageName).add(row.name,{
                type: 'automatic',
                name: row.name,
                path,
                creation_date: Date.now()
            });
        });
    }
    private getAutoAlgsSavedLocally = async () => {
        const files = await fs.readdir('./automatic-algorithms');
        let algNames = [];
        await forEP(files, async (file:string) => {
            if(file.endsWith('.py')){
                algNames.push(file);
            }
        });
        return algNames;
    }

    addImage = async (name, buffer) => {
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

        //we should fetch newly algorithms 

        const automaticAlgsSavedLocally = await this.getAutoAlgsSavedLocally()
       
        const {tables} = await this.pythonService.runAutomaticAlgs(
            automaticAlgsSavedLocally,
            files.text,
            files.base_sent_table);
        await this.addAutomaticAlgToImg(tables,name);
    }

    getImages = async () => {
        const imagesCollection = await this.collectionsService.images();
        const images  = await imagesCollection.getAll();

        return images;
    }

    getSummary = async (experimentId, type, name)=> {
        if(type === 'auto'){
            const autoSentTable = await this.collectionsService.images().sentTablesOf('auto5').get(name);
            const csvFile = await this.storageService.downloadToBuffer(autoSentTable.path)
            return await csv({delimiter:'auto'}).fromString(csvFile.toString());
        }
    }

    getSummaries = async (experimentId)=> {
        const eyesExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        const mergedExample = {id: 'eye1',data:{name:'eye1', creation_date:Date.now()}}
        //we should get the image from experiment, but wasn't implemented yet.
        const autoSentTables = await this.collectionsService.images().sentTablesOf('auto5').getAll();
        const autoDisabled = [{id:'alg3',data:{name:'alg3'}, disabled: true}];
        return{
            auto: [...autoSentTables, ...autoDisabled],
            eyes: Array(15).fill(eyesExample),
            merged: Array(15).fill(mergedExample),
        }

    }

    //TODO - check if exists download if needed
    // we could check with in memory data
    private verifyAutomaticAlgorithmExists = async (names: string[]) => {};

    runAutomaticAlgs = async (algsNames: string[], imageName:string, options: {text?: Buffer, base_sent_table?: Buffer } ) => {
        const text = options.text || await this.storageService.downloadToBuffer(`images/${imageName}/text`);
        const base_sent_table = options.base_sent_table || await this.storageService.downloadToBuffer(`images/${imageName}/base_sent_table`);
        await this.verifyAutomaticAlgorithmExists(algsNames);
        const {tables} = await this.pythonService.runAutomaticAlgs(algsNames, text,base_sent_table);
        await this.addAutomaticAlgToImg(tables,imageName);
    }

    addAutomaticAlgorithms = async (name, buffer) => {
        const path = `automatic-algos/${name}`
        await this.storageService.uploadBuffer(path, buffer, fileTypes.Text);
        await this.collectionsService.automaticAlgos().add(name,{
            name,
            path,
            uploaded_date: Date.now()
        });
    };
    

}