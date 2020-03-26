
export default function formatXML(content) {
  console.log(content)
  const startContent = '<?xml version="1.0" encoding="UTF-8"?>'
  if (content.indexOf(startContent) >= 0) {
    content = content.substring(39)
  }
  let xml_doc = null
  try {
    xml_doc = (new DOMParser()).parseFromString(content.replace(/[\n\r\s]/g, ''), 'text/xml')
    console.log(xml_doc.documentElement)
  } catch (e) {
    console.log(e)
    return false
  }
  let flag = 0
  function build_xml(index, list, element) {
    let t = []
    for (let i = 0; i < flag; i++) {
      t.push('&nbsp;&nbsp;&nbsp;&nbsp;')
    }
    t = t.join('')
    list.push(t + '&lt;<span class="code-key">' + element.nodeName + '</span>&gt;<br/>')
    for (let i = 0; i < element.childNodes.length; i++) {
      const nodeName = element.childNodes[i].nodeName
      if (element.childNodes[i].childNodes.length === 0) {
        const value_txt = ''
        const item = t + '&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="code-key">' + nodeName +
          '</span>&gt;' + value_txt + '&lt;/<span class="code-key">' + nodeName + '</span>&gt;<br/>'
        list.push(item)
      } else if ((element.childNodes[i].childNodes.length === 1 && element.childNodes[i].childNodes[0].nodeValue != null)) {
        const value = element.childNodes[i].childNodes[0].nodeValue
        const value_color = !isNaN(Number(value)) ? 'code-number' : 'code-string'
        const value_txt = '<span class="' + value_color + '">' + value + '</span>'
        const item = t + '&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="code-key">' + nodeName +
          '</span>&gt;' + value_txt + '&lt;/<span class="code-key">' + nodeName + '</span>&gt;<br/>'
        list.push(item)
      } else {
        flag++
        build_xml(++index, list, element.childNodes[i])
        flag--
      }
    }
    list.push(t + '&lt;/<span class="code-key">' + element.nodeName + '</span>&gt;<BR/>')
  }

  const list = []
  list.push(startContent)
  build_xml(0, list, xml_doc.documentElement)

  return list.join('')
}
