let fm
try {fm = FileManager.iCloud()} catch (err) {fm = FileManager.local()}
try {fm.documentsDirectory()} catch(e) {fm = FileManager.local()}

const docDir = fm.documentsDirectory()
const path = fm.joinPath(docDir, "RSSWidget.js")
const pathAlt = fm.joinPath(docDir, "RSS-Widget.js")
const pathBackup = fm.joinPath(docDir, "RSSWidgetBackup.js")
const pathBackup2 = fm.joinPath(docDir, "RSSWidgetBackup2.js")

let alertMsg = "No Message"

try {
  const latestVersion = await new Request("https://raw.githubusercontent.com/keunsy/scriptable-News-Widget/main/RSSWidget.js").loadString();
  
  if (fm.fileExists(pathBackup2)) {await fm.remove(pathBackup2);}

  if (fm.fileExists(pathBackup)) {await fm.move(pathBackup, pathBackup2);}

  if (fm.fileExists(pathAlt)) {
    await fm.move(pathAlt, pathBackup);
  } else if (fm.fileExists(path)) {
    await fm.move(path, pathBackup);
  }

  if (fm.fileExists(path) || await fm.fileExists(pathAlt)) {
    await fm.remove(path);
    await fm.remove(pathAlt);
  }
  
  await fm.writeString(path, latestVersion);
  
  if (fm.fileExists(pathBackup2)) {await fm.remove(pathBackup2);}
  
  alertMsg = "已经更新!\n\n旧文件保存为\n'RSSWidgetBackup'"
} catch(err) {
  alertMsg = "更新中发生错误：\n\n"+err+"\n\n"
}

let alert = new Alert();
alert.message = "\n"+alertMsg;
alert.title = "News Widget Update";
alert.addAction("OK");
alert.presentAlert();
