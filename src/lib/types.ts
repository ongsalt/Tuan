// Need funcion to pass template
export type Template = State<string>

export type ElementProps =  {
    template?: Template,
    children?: QElement[]
    class?: Template | string
    onclick?: EventListener
}

export type QElement = () => {
    htmlElement: HTMLElement,
}

export type State<T> = {
    value: T,
    oldValue?: T,
    _subscriber: Subscriber<T>[],
    _subscribe: (s: Subscriber<T>) => void
} 

export type Subscriber<T> = (value: T, oldValue?: T) => any
