/*
 *  the only real need for runtime is for dom colliding
 *  the rest of this implementation is just global variables\
 * 
 *  do EventBus later becuase it cool
 */

const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

type HiddenElement = {
    elseNode: Node,
    node: Node
}

export class Runtime {
    private hiddenElement: Map<string, HiddenElement> = new Map()

    generateNodeId() {
        let id;
        do {
            id = "qaueda-" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        } while(this.hiddenElement.has(id))
        return id
    }


    hideNode(node: Node, id: string) {
        const comment = document.createComment(id)
        
        this.hiddenElement.set(id, { elseNode: comment, node })

        // This thing is used for replace commnet <-> element
        // comment.parentNode?.replaceChild(comment, node)
        node.parentNode?.replaceChild(comment, node)
        // proceed to remove from dom and replace it with comment

        return comment
    }

    showNode(id: string) {
        const hidden = this.hiddenElement.get(id)

        if (!hidden) {
            throw new Error("Id not found")
        }
        const { elseNode: comment, node } = hidden
        // This thing is used for replace commnet <-> element
        comment.parentNode?.replaceChild(node, comment)
        
        this.hiddenElement.delete(id)
    }
    
    swithNode(newNode: Node, oldNode: Node) {
        oldNode.parentNode?.replaceChild(newNode, oldNode)
    }

}

export const runtime = new Runtime()
