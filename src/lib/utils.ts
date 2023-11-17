type ArrayDiff<T> = {
    type: "add",
    index: number,
    data: T
} | {
    type: "remove",
    index: number
} | {
    type: "move",
    from: number,
    to: number
}

export function findArrayDiff<T>(value: T[], oldValue: T[]): ArrayDiff<T>[] {
    const diffs: ArrayDiff<T>[] = []
    oldValue.forEach((it, i) => {
        if (!value.includes(it)) {
            diffs.push({
                index: i,
                type: "remove"
            })
        }
    })

    // No, I need to be aware of 'removed' too
    let addCount = 1
    value.forEach((it, i) => {
        if (!oldValue.includes(it)) { // if it didnt exist in previous state (ADD)
            diffs.push({
                type: "add",
                data: it,
                index: i - addCount // this is inserting position got add
            })
        }
        addCount++
    })

    return diffs

}