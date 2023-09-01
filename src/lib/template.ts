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

export function createElement() {

}

/**
 * @summary template literal if state got passed in this will keep track of them
 * @example my name is ${name}
 */
export function q(strings: TemplateStringsArray, ...rest: (string | State<any>)[]): Template {
    // Should subscribe to every state
    // Should return observable

    const dependencies = rest.filter(it => typeof it !== 'string')

    

    return () => {
        return strings.reduce((prev, it, i) => {
            if (i !== strings.length - 1) {
                const r = rest[i]
                if (typeof r === 'string') {
                    return it + prev + r
                } else {
                    return it + prev + r.value
                }
            }

            return it + prev

        }, "")
    }
}

export function div(props: ElementProps) {
    // create div
    // mount to dom but where -> keep track of dom stack in runtime?
    const el = document.createElement('div')

    // Should not do this we should add subscriber for building text
    if (props.template) {
        el.innerHTML
    }

    if (props.onclick) {
        el.addEventListener('click', props.onclick)
    }

    runtime.domStack.push(el)

    // do something with el context scope

    runtime.domStack.pop()

    return el
}

export function syncDomTree() {

}