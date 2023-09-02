/* 
 *  Todo
 *   - Template engine
 *      [later] Function component
 *      children rendering
 *      
 *   - Reactive
 *      Basic Idea: using Proxy
 *      computed hook
 *      [DONE for now]
 * 
 *   - Dom diff
 *      when doing conditional rendering
 *      or i should just do QElement | State<QElement>
 *  
 *   - Lifecycle hook
 *      component funciton only run once
 */

import * as Reactive from './reactive'
import * as Template from './template'

const Qaeda = { Reactive, Template }

export default Qaeda
export { Reactive, Template }
