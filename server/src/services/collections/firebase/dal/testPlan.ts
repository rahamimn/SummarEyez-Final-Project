import { BaseCollection } from "./baseCollection";

export class TestPlans extends BaseCollection {
    collection;
    constructor(collection){
        super(collection);
        this.collection = collection;
    }

    ratingAnswersOf(testPlanId){
        return new BaseCollection(this.collection.doc(testPlanId).collection('rating_answers'))
    }

}