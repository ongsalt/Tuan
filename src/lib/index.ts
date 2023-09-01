/* 
 *  Part
 *   - Template engine
 *      [later] Function component
 *   - Reactive
 *      Basic Idea: using Proxy
 *      computed hook
 *   - Dom diff
 *  Notes
 *   - vue like lifecycle
 *      component funciton only run once
 */

import * as Reactive from './reactive'
import * as Template from './template'

const Qaeda = { Reactive, Template }

export default Qaeda
export { Reactive, Template }