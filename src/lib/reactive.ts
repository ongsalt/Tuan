import { State } from "./types"

export function state<T>(value: T): State<T> {
    const data: State<T> =  {
        value,
        _subscriber: [],
        _subscribe(s) {
            this._subscriber.push(s)
        }
    }

    return new Proxy(data, {
        // get(target, p, receiver) {
        //     return Reflect.set(target, p, receiver)
        // },
        set(target, p, newValue, receiver) {
            // Do something if target is "value"
            if (p === "value") {
                target._subscriber.forEach(s => {
                    s(newValue as T, target.oldValue)
                })
            }
            return Reflect.set(target, p, newValue, receiver)
        },
    })
}

// export function stateFrom<T>(emitter: (emit: (value: T) => void) => void): State<T> {

//     const value = emitter((value) => {

//     })

//     const data: State<T> =  {
//         value,
//         _subscriber: [],
//         _subscribe(s) {
//             this._subscriber.push(s)
//         }
//     }

//     return new Proxy(data, {
//         // get(target, p, receiver) {
//         //     return Reflect.set(target, p, receiver)
//         // },
//         set(target, p, newValue, receiver) {
//             // Do something if target is "value"
//             if (p === "value") {
//                 target._subscriber.forEach(s => {
//                     s(newValue as T, target.oldValue)
//                 })
//             }
//             return Reflect.set(target, p, newValue, receiver)
//         },
//     })
// }

export function combine<T,S,U>(state1: State<T>, state2: State<S>, combinator: (value1: T, value2: S) => U): State<U> {

    const data: State<U> = {
        value: combinator(state1.value, state2.value),
        _subscriber: [],
        _subscribe(s) {
            this._subscriber.push(s)
        }
    }

    state1._subscriber.push(it => {
        data.value = combinator(it, state2.value)
    })
    state2._subscriber.push(it => {
        data.value = combinator(state1.value, it)
    })

    return data

}
