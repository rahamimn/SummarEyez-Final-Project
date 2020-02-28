import { CollectionMock } from './collections.mock';

describe('collection mock',() =>{
    let collectionService: CollectionMock;

    beforeEach(() => {
        collectionService = new CollectionMock();
    });

    it('set image and get simple',  () => {
        const data = {data: 'somedata'};
        const id = 'img1';

        collectionService.images().add(id,data);

        expect(collectionService.images().get(id)).toBe(data);
    });

    it('set and get complex hierarchy',  () => {
        const data = {data: 'somedata'};
        const innerData = {data: 'somedata'};
        const outerId = 'img1';
        const innerId = 'sentId';
        collectionService.images().add(outerId,data);
        debugger;
        collectionService.images().sentTablesOf(outerId).add(innerId, innerData);

        expect(collectionService.images().sentTablesOf(outerId).get(innerId)).toBe(innerData);
    });


});