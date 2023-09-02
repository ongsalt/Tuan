
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

import { button, div, h1, h2, h3, p, q, qFragment, qIf } from "./lib/template";
import { combine, derived, state } from "./lib/reactive";
import { runtime } from "./lib/runtime";

const app = document.getElementById('app')

// const num = state(1)
// const num2 = state(1)
let show = state(true)
let show2 = state(true)


// const sum = combine(num, num2, (i, j) => {
//     const result = i + j
//     // console.log(i + j)
//     return result
// })

// const double = derived(() => sum.value * 2)

// const textDisplay = h1({
//     template: q`${num} + ${num2} = ${sum}`,
// })

// const stateTest = div({
//     children: [
//         textDisplay,
//         h3({
//             template: q`Doubled: ${double}`
//         }),
//         div({
//             template: q`Num 1 is ${num}`
//         }),
//         div({
//             children: [
//                 button({
//                     template: q`Update num 1`,
//                     onclick: () => num.value++
//                 }),
//                 button({
//                     template: q`Update num 2`,
//                     onclick: () => num2.value++
//                 })
//             ]
//         })
//     ]
// })

const conditionalRenderingTest = div({
    children: [
        h2({
            template: q`Conditional rendering test`
        }),
        button({
            onclick: () => show.value = !show.value,
            template: q`${show.value ? "show 1" : "show 2"}`
        }),
        qIf(
            () => show.value,
            div({
                children: [
                    h2({
                        template: q`Text 1`
                    }),
                    button({
                        onclick: () => show2.value = !show2.value,
                        template: q`${show2.value ? "1" : "2"}`
                    }),
                ]
            }),
            qIf(
                () => show2.value,
                h2({
                    template: q`text 2`
                }),
                p({
                    template: q`i am the storm2`
                })
            ),
        ),
    ]
})


app?.appendChild(conditionalRenderingTest.render())
