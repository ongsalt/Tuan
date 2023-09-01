import { state } from "./reactive";
import { runtime } from "./runtime";
import { ElementProps, State, Template } from "./types";

/*
 * Expected template inner
//  * my name is {{ name }}  NOOOOO
 * my name is ${name}
 * then check if name is state 
 *   if yes
 *      add subscriber
 *   else
 *      try to call toString or [object Object]
 * 
 */

// const regex = /\{\{[^{}]+\}\}/g

export function createElement(tag: keyof HTMLElementTagNameMap) {
    return (props: ElementProps) => {
        // create div
        // mount to dom but where -> keep track of dom stack in runtime?
        const el = document.createElement('div')

        // Should not do this we should add subscriber for building text
        if (props.template) {
            console.log("updating innertext")
            el.innerHTML = props.template.value
            props.template._subscriber.push(it => el.innerHTML = it)
        }

        if (props.onclick) {
            el.addEventListener('click', props.onclick)
        }

        runtime.domStack.push(el)

        // do something with el context scope

        runtime.domStack.pop()

        return el
    }
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
        console.log("Registering callback")
        it._subscriber.push(() => {
            innerHtmlState.value = update()
        })
    })

    return innerHtmlState
}

export function syncDomTree() {

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
