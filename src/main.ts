
/* 
 * Expected interface -> App.mount('#app')  
 * div({
 *  inner: "templatefjkhuygfer",
 * })
 * 
 * Why tf it look like flutter
 *
 */
import './app.css'

import { button, div, h1, h2, h3, q, qIf } from "./lib/template";
import { combine, derived, state } from "./lib/reactive";
import { runtime } from "./lib/runtime";

const app = document.getElementById('app')
const hidden1 = document.getElementById('hidden1')
const sb = document.getElementById('sb')

const num = state(1)
const num2 = state(1)
let show = state(false)
let id: string


const sum = combine(num, num2, (i, j) => {
    const result = i + j
    // console.log(i + j)
    return result
})

const double = derived(() => sum.value * 2)

const textDisplay = h1({
    template: q`${num} + ${num2} = ${sum}`,
})

const stateTest = div({
    children: [
        textDisplay,
        h3({
            template: q`Doubled: ${double}`
        }),
        div({
            template: q`Num 1 is ${num}`
        }),
        div({
            children: [
                button({
                    template: q`Update num 1`,
                    onclick: () => num.value++
                }),
                button({
                    template: q`Update num 2`,
                    onclick: () => num2.value++
                })
            ]
        })
    ]
})

const conditionalRenderingTest = div({
    children: [
        h2({
            template: q`Gaythai1`
        }),
        button({
            onclick: () => show.value = !show.value,
            template: q`${show.value ? "Hide" : "Show"}`
        }),
        qIf(
            () => show.value,
            h2({
                template: q`Gaythai45`
            }),
        ),
    ]
})



app?.appendChild(conditionalRenderingTest.render())
