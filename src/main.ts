
/* 
 * Expected interface -> App.mount('#app')  
 * div({
 *  inner: "templatefjkhuygfer",
 *  
 * })
 *
 */

import { div, q } from "./lib/template";
import { combine, state } from "./lib/reactive";

const app = document.getElementById('app')
const incbtn = document.getElementById('inc')
const incbtn2 = document.getElementById('inc2')

const num = state(1)
const num2 = state(1)

const num3 = combine(num, num2, (i, j) => {
    const result = i + j
    console.log(i + j)
    return result
})

incbtn?.addEventListener('click', () => {
    num.value++
})

incbtn2?.addEventListener('click', () => {
    num2.value++
})


const a = div({
    template: q`my name is ${num}`
})



app?.appendChild(a)
