import _ from 'lodash'
let documents = []

// 定义一个函数来添加新文档
function addDocument(title, date, url, fileType, prefixPath, key, number) {
  // 获取当前最大的id值，并递增1
  let maxId = documents.reduce((max, doc) => Math.max(max, parseInt(doc.id)), 0);
  let newId = (maxId + 1).toString().padStart(5, '0');

  // 创建新的文档对象
  let newDocument = {
    id: newId,
    title: title,
    date: date,
    url: url,
    fileType: fileType,
    prefixPath: prefixPath,
    key: key,
    number: number
  };

  // 将新的文档添加到静态数据源
  documents.push(newDocument);
}

addDocument('中华人民共和国个人所得税法', '2018-08-31', 'https://fgk.chinatax.gov.cn/zcfgk/c100009/c5193028/content.html', 'pdf', '个人所得税', 'geshui')

addDocument('中华人民共和国个人所得税法实施条例', '2018-12-18', 'https://fgk.chinatax.gov.cn/zcfgk/c100010/c5194444/content.html', 'pdf', '个人所得税', 'geshui')

addDocument('国家税务总局陕西省税务局关于明确我省个人住房转让所得征收个人所得税核定比例的公告', '2018-12-18', 'https://shaanxi.chinatax.gov.cn/art/2018/6/15/art_5383_184090.html', 'pdf', '个人所得税', 'geshui')

addDocument('国家税务总局关于个人住房转让所得征收个人所得税有关问题的通知', '2006-07-18', 'https://fgk.chinatax.gov.cn/zcfgk/c100012/c5193804/content.html', 'pdf', '个人所得税', 'geshui', '国税发〔2006〕108号')

addDocument('财政部 国家税务总局关于个人所得税若干政策问题的通知', '1994-05-13', 'https://fgk.chinatax.gov.cn/zcfgk/c102416/c5202580/content.html', 'pdf', '个人所得税', 'geshui', '财税字〔1994〕20 号')
// 契税
addDocument('中华人民共和国契税法', '2020-08-11', 'https://fgk.chinatax.gov.cn/zcfgk/c100009/c5193053/content.html', 'pdf', '契税', 'qishui')
// 公积金
addDocument('个人住房公积金贷款业务指南', '2024-05-16', 'https://zfgjj.xa.gov.cn/xxgk/zcfg/1791017767056011265.html', 'pdf', '公积金', 'gongjijin')
addDocument('关于放开“公寓类住房”个人公积金贷款的通告', '2015-07-22', 'https://zfgjj.xa.gov.cn/xxgk/zcfg/5da86db9f99d6527b6bbe908.html', 'pdf', '公积金', 'gongjijin')
// 使用 Lodash 将文档按 key 字段分组
let documentsGroupBykey = _.groupBy(documents, 'key');
console.log(documents, documentsGroupBykey, 'documents')

function findByKeyname(keyname, value) {
  return _.find(documents, {
    [keyname]: value
  })
}
export {
  documents,
  documentsGroupBykey,
  findByKeyname
}