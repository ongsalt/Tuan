// Need funcion to pass template
export type Template = State<string>

export interface QElement {
    render(): Node
    onMount?: () => void
}

export interface QIfElement extends QElement {
    if: QElement
    else?: QElement
} 

export interface QForElement extends QElement {

} 

export type ElementProps = {
    template?: Template
    children?: QElement[]
    class?: Template | string
    onclick?: EventListener
} 
// & ({} | { qFor: <T>() => T })

export type State<T> = {
    value: T,
    oldValue?: T,
    _subscriber: Subscriber<T>[],
    _subscribe: (s: Subscriber<T>) => void
}

export type StateOrToBeDerive<T> = State<T> | (() => T)

export type Subscriber<T> = (value: T, oldValue?: T) => any
