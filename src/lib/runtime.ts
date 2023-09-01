/*
 * name: Qaeda 
 */

import { ElementProps, State } from "./types"

export class Runtime {
    private states: State<any>[] = []
    public domStack: HTMLElement[] = []
}

export const runtime = new Runtime()
