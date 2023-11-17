import { combine, derived, state } from "./reactive";
import { runtime } from "./runtime";
import { ElementProps, QElement, QForElement, QIfElement, State, Template } from "./types";
import { findArrayDiff } from "./utils";

/*
 * Expected template inner
//  * my name is {{ name }}  NOOOOO it too hard to do
 * my name is ${name}
 * then check if name is state 
 *   if yes
 *      add subscriber
 *   else
 *      try to call toString or [object Object]
 * 
 */

// const regex = /\{\{[^{}]+\}\}/g

// Build(?) time only context
const context = {
    domStack: [] as HTMLElement[],
    index: 0,
}

export function createElement(tag: keyof HTMLElementTagNameMap) {
    return (props: ElementProps): QElement => ({
        render() {
            // create div
            // mount to dom but where -> keep track of dom stack in context?
            const el = document.createElement(tag)

            // Should not do this we should add subscriber for building text
            if (props.template) {
                // console.log("updating innertext")
                el.innerHTML = props.template.value
                props.template._subscriber.push(it => el.innerHTML = it)
            }

            if (props.onclick) {
                el.addEventListener('click', props.onclick)
            }

            if (props.children) {
                context.domStack.push(el)
                // do something with el context scope
                props.children.forEach(it => {
                    ++context.index
                    el.appendChild(it.render())
                    // if this thing is mounted -> run onMount 
                    // if not add to queue in context 
                })

                context.domStack.pop()
            }

            return el
        },
        onMount() {

        },

    })
}

/**
 * @summary template literal if state got passed in this will keep track of them
 * @example my name is ${name}
 */
export function q(strings: TemplateStringsArray, ...rest: (string | (() => string) | State<any>)[]): Template {
    // Should subscribe to every state
    // Should return observable

    const derivedRest: (string | State<any>)[] = rest.map(it => {
        if (typeof it === 'function') {
            console.log("derived")
            return derived(it)
        }
        return it
    })

    const update = () => strings.reduce((prev, it, i) => {
        if (i !== strings.length - 1) {
            const r = derivedRest[i]
            if (typeof r === 'string') {
                return prev + it + r
            } else {
                if (typeof r.value === 'object') {
                    return prev + it + r.value.toString()
                } else {
                    return prev + it + r.value
                }
            }
        }
        return prev + it
    }, "")

    const innerHtmlState = state(update())

    const dependencies: State<any>[] = derivedRest.filter((it): it is State<any> => (typeof it !== 'string'))

    console.log("Dependencies of", innerHtmlState.value)
    dependencies.map(it => {
        console.log("Registering callback", it)
        it._subscriber.push(() => {
            innerHtmlState.value = update()
        })
    })
    console.log("done")

    return innerHtmlState
}

/**
 * Change interface later
 * should be like this qif({ condition, element, elseElement })
 * condition should be State<boolean> | boolean instead of having to derived later
 */
export function qIf(condition: () => boolean, element: QElement, elseElement?: QElement): QIfElement {
    const shouldShow = derived(condition)
    const id = runtime.generateNodeId()
    // Register q-[id] to element => leave comment in tree to mark its position in dom 

    const resElement: QIfElement = {
        if: element,
        render() {
            const defaultElement = element.render()
            let internalElseElement: Node;
            if (this.else) {
                internalElseElement = this.else.render()
            }
            shouldShow._subscriber.push(it => {
                if (this.else) {
                    if (it) {
                        runtime.swithNode(defaultElement, internalElseElement)
                    } else {
                        runtime.swithNode(internalElseElement, defaultElement)
                    }
                    return
                }
                if (it) {
                    runtime.showNode(id)
                } else {
                    runtime.hideNode(defaultElement, id)
                }
            })


            if (shouldShow.value) {
                console.log(defaultElement)
                return defaultElement
            } else {
                if (this.else) {
                    return internalElseElement!
                }
                return runtime.hideNode(defaultElement, id)
            }
        },
    }

    if (elseElement) {
        resElement.else = elseElement
    }

    return resElement
}

/**
 * Each children should keep track of their dependencies.
 * But When array change it need to append element to specific position
 */

export function qFor<T>(list: State<Array<T>>, elementTemplate: (it: T, index: number) => QElement): QForElement {
    const elements = list.value.map((it, index) => {
        const e = {
            ...elementTemplate(it, index)
        }
        return e
    })

    list._subscriber.push((value, oldValue) => {
        if (!oldValue) return

        // find diff with order (like git) -> add(index), remove(index)
        // Need to recalculate position upon mutating the dom

        const diff = findArrayDiff(value, oldValue)
        
        // get parent element via ???
        // 1. context.stack but this need to be evaluate from parent function
        // 2. get some of the child and find parent element -> but if length is 0 then this wont work
        //     -> vIf then use the comment as anchor -> problem solved
        // 3. 
        // .insertBefore
    })

    // i should improve this
    return qFragment(...elements)
}

/**
 * Unstable, Don't use this (at least for now)
 * this dont keep track of it children (yet???)
 * @param elements 
 * @returns New elements that render all passed in element
 */
export function qFragment(...elements: QElement[]): QElement {
    const fragment = new DocumentFragment()

    elements.forEach(it => {
        fragment.appendChild(it.render())
    })

    return {
        render() {
            return fragment
        },
        onMount() {
            // run the rest on mount
        },
    }

}

export const div = createElement('div')
export const nav = createElement('nav')
export const section = createElement('section')
export const main = createElement('main')
export const header = createElement('header')
export const a = createElement('a')
export const button = createElement('button')
export const p = createElement('p')
export const hr = createElement('hr')
export const br = createElement('br')
export const h1 = createElement('h1')
export const h2 = createElement('h2')
export const h3 = createElement('h3')
export const h4 = createElement('h4')
export const h5 = createElement('h5')
export const h6 = createElement('h6')
