
/* 
 * Expected interface -> App.mount('#app')  
 * div({
 *  inner: "templatefjkhuygfer",
 *  
 * })
 *
 */

import { div, h1, h3, q } from "./lib/template";
import { combine, derived, state } from "./lib/reactive";

const app = document.getElementById('app')
const incbtn = document.getElementById('inc')
const incbtn2 = document.getElementById('inc2')

const num = state(1)
const num2 = state(1)

const sum = combine(num, num2, (i, j) => {
    const result = i + j
    // console.log(i + j)
    return result
})

const double = derived(() => num.value * 2)

incbtn?.addEventListener('click', () => {
    num.value++
})

incbtn2?.addEventListener('click', () => {
    num2.value++
})


const a = h1({
    template: q`num1 is ${num} | num2 is ${num2} | sum is ${sum}`,
})

const b = div({
    children: [
        a,
        h3({
            template: q`Doubled: ${double}`
        }),
        div({
            template: q`Num 1 is ${num}`
        })
    ]
})


app?.appendChild(b().htmlElement)
