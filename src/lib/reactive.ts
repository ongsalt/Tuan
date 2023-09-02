import deepEqual from "deep-equal"
import { State } from "./types"

/*
    Build(?) time only context
    This one doesn't work with template: ${state.value ? "" : ""}

    Svelte is compiler it can do this anytime. React use virtual dom.

    Bullshit way to solve this is change the syntax to ${() => (state.value ? "" : "")} 
    but this ways has the need to chage q parser to accept funtion as one of arguments and derive it
    or create derived state: () => (state.value ? "" : "") in other place and use it as state 


    
    Vue approach: When a dependency used during mount changes, the effect re-runs. from their wiki
    I can't do this becuase vue use A FUCKING TEMPLATING LANGUAGE not full js

    Or should i just create a templating language -> Better do this the svelte way
*/
const context = {
    isTrackingDependencies: false,
    trackedDependencies: [] as State<any>[]
}

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
            // Such a dirty way to implement
            if (context.isTrackingDependencies) {
                context.trackedDependencies.push(target)
            }
            return Reflect.get(target, p, receiver)
        },
        set(target, p, newValue, receiver) {
            // Do something if target is "value"
            const ok = Reflect.set(target, p, newValue, receiver)
            if (ok && p === "value") {
                // only re run if new value is not the same
                if (!deepEqual(newValue, data.oldValue)) {
                    target.oldValue = newValue
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
    context.isTrackingDependencies = true
    const data = state(transform())
    context.isTrackingDependencies = false

    context.trackedDependencies.map(it =>
        it._subscriber.push(it => {
            data.value = transform()
        })
    )

    context.trackedDependencies = []
    return data
}


/**
 * fine-grained reactivity, better than derived(?)
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
