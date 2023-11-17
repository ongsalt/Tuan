import { createElement } from "./element";
import { QElement } from "./types";

/* Expected template inner
 * my name is {{ name }}  NOOOOO it too hard to do
 * then check if name is state 
 *   if yes
 *      add subscriber
 *   else
 *      derived it and then add to subscriber
 */
export function parse(html: string): QElement {

    // can set static html
    // then need to check if which part is dynamic 

    return createElement('a')({})
}
