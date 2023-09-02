import { combine, derived, state } from "./reactive";
import { runtime } from "./runtime";
import { ElementProps, QElement, QIfElement, State, Template } from "./types";

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
export function q(strings: TemplateStringsArray, ...rest: (string | State<any>)[]): Template {
    // Should subscribe to every state
    // Should return observable

    const update = () => strings.reduce((prev, it, i) => {
        if (i !== strings.length - 1) {
            const r = rest[i]
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

    const dependencies: State<any>[] = rest.filter((it): it is State<any> => (typeof it !== 'string'))

    dependencies.map(it => {
        // console.log("Registering callback")
        it._subscriber.push(() => {
            innerHtmlState.value = update()
        })
    })

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
            shouldShow._subscriber.push(it => {
                if (it) {
                    runtime.showNode(id)
                } else {
                    runtime.hideNode(defaultElement, id)
                }
            })
            if (shouldShow.value) {
                return defaultElement
            } else {
                return runtime.hideNode(defaultElement, id)
            }
        },
    }

    if (elseElement) {
        resElement.else = elseElement
    }

    return resElement
}

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
export const h1 = createElement('h1')
export const h2 = createElement('h2')
export const h3 = createElement('h3')
export const h4 = createElement('h4')
export const h5 = createElement('h5')
export const h6 = createElement('h6')
