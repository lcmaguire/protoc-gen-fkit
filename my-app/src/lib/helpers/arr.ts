
export function pushArray(arr: any[], val: any) {
    if (arr == undefined){
        arr = []
    }
    return arr.concat(val)
}
