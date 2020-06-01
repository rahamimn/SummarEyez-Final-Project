import { BaseCollectionMock } from "./baseCollection.mock";
import { TestPlans } from '../../firebase/dal/testPlan';

export class TestPlanMock extends BaseCollectionMock implements TestPlans{
    collection;
    constructor(collection){
        super(collection)
        this.collection = collection;
    }

    ratingAnswersOf(testPlanId:string){
        return this.getSubCollectionOf(testPlanId,'rating_answers',BaseCollectionMock);
    }
}