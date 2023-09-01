import deepEqual from "deep-equal"
import { State } from "./types"
import { runtime } from "./runtime"

export function state<T>(value: T): State<T> {
    const data: State<T> = {
        value,
        _subscriber: [],
        _subscribe(s) {
            this._subscriber.push(s)
        }
    }

    return new Proxy(data, {
        get(target, p, receiver) {
            if (runtime.isTrackingDependencies) {
                runtime.trackedDependencies.push(target)
            }
            return Reflect.get(target, p, receiver)
        },
        set(target, p, newValue, receiver) {
            // Do something if target is "value"
            const ok = Reflect.set(target, p, newValue, receiver)
            if (ok && p === "value") {
                // only re run if new value is not the same
                target.oldValue = newValue
                if (!deepEqual(value, data.oldValue)) {
                    target._subscriber.forEach(s => {
                        s(newValue as T, target.oldValue)
                    })
                }
            }
            return ok
        },
    })
}

export function derived<T>(transform: () => T) {
    // Track dependencies using scope
    runtime.isTrackingDependencies = true
    const data = state(transform())
    runtime.isTrackingDependencies = false

    runtime.trackedDependencies.map(it =>
        it._subscriber.push(it => {
            data.value = transform()
        })
    )

    runtime.trackedDependencies = []
    return data
}


/**
 * fine-grained reactivity, better than derived
 * @param state1 State to combine
 * @param state2 Other state to combine
 * @param combinator Function that reduce those two state value
 * @returns New State based on those 2 combined
 */
export function combine<T, S, U>(state1: State<T>, state2: State<S>, combinator: (value1: T, value2: S) => U): State<U> {

    const data = state(combinator(state1.value, state2.value))

    state1._subscriber.push(it => {
        data.value = combinator(it, state2.value)
    })
    state2._subscriber.push(it => {
        data.value = combinator(state1.value, it)
    })

    return data
}
