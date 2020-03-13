import { CollectionMock } from './collections.mock';

describe('collection mock',() =>{
    let collectionService: CollectionMock;

    beforeEach(() => {
        collectionService = new CollectionMock();
    });

    it('set image and get simple', async () => {
        const data = {data: 'somedata'};
        const id = 'img1';

        await collectionService.images().add(id,data);

        expect(await collectionService.images().get(id)).toBe(data);
    });

    it('set and get complex hierarchy',  async () => {
        const data = {data: 'somedata'};
        const innerData = {data: 'somedata'};
        const outerId = 'img1';
        const innerId = 'sentId';
        await collectionService.images().add(outerId,data);
        await collectionService.images().sentTablesOf(outerId).add(innerId, innerData);

        expect(await collectionService.images().sentTablesOf(outerId).get(innerId)).toBe(innerData);
    });


});