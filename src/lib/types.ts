// Need funcion to pass template
export type Template = {}

export type ElementProps =  {
    template?: Template,
    children?: ElementProps[]
    onclick?: EventListener

}

export type State<T> = {
    value: T,
    oldValue?: T,
    _subscriber: Subscriber<T>[],
    _subscribe: (s: Subscriber<T>) => void
} 

export type Subscriber<T> = (value: T, oldValue?: T) => any
