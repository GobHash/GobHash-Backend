import visit from 'unist-util-visit';

import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('nodejs', javascript);

/**
 * Adapted from remark-highlight.js
 * https://github.com/ben-eb/remark-highlight.js
 */
export default function attacher() {
    function visitor(node) {
        if (node.lang) {
            node.type = 'html';
            node.value = `<pre class='hljs'>${hljs.highlightAuto(node.value, [node.lang]).value}</pre>`;
        }
    }

    return ast => visit(ast, 'code', visitor);
}
