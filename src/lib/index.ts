/* 
 *  Todo
 *   - Template engine
 *      [later] Function component
 *      children rendering
 *      
 *   - Reactive
 *      Basic Idea: using Proxy
 *      computed hook
 *      input binding
 * 
 *   - DX/Interface Transformation
 *      vfc-or-.svelte-like component file
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

export * from './reactive'
export * from './template'

const Qaeda = { ...Reactive, ...Template }

export default Qaeda
