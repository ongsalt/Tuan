/*
 *  the only real need for runtime is for dom colliding
 *  the rest of this implementation is just global variables
 */

import { QElement } from "./types"

export class Runtime {

    constructor(
        private root: QElement
    ) {}

    mount(targetQuery: string) {
        const target = document.querySelector(targetQuery)

        target?.appendChild(this.root().htmlElement)
    }
}
