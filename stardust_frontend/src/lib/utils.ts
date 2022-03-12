export function shorten(data: string) {
    return data.slice(0, 4).concat("...").concat(data.slice(data.length - 4, data.length))
}
