/*
 *  
 */

import { ElementProps, State } from "./types"

export class Runtime {
    public domStack: HTMLElement[] = []

    public isTrackingDependencies = false
    public trackedDependencies: State<any>[] = []

    mount(target: string) {
        return document.querySelector(target)
    }
}

export const runtime = new Runtime()
