


const getHandler = (page,datahook) => page.$(`[datahook="${datahook}"]`);

export const fullPageDriver = async (page) => {
    const elementHandler = await getHandler(page,'full-page');
    
    return {
        exists : () => !!elementHandler
    }
};
