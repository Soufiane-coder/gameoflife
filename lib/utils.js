
export const formatingDateToISO = (date=new Date()) => {
    try{
        return new Date(date).toISOString().slice(0, 10)
    }
    catch(err){
        console.log(err)
    }
}