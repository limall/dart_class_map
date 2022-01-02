const fs = require('fs');
const util = require('./util');

const filePath = process.argv.splice(2)[0];
// const filePath='D:\\workspace_win10\\relation\\zilvshuo_relation\\lib\\duoduan\\task_instance.dart';
const contentOrigin = fs.readFileSync(filePath).toString();

const classStartTagIndex = contentOrigin.indexOf('@mapable_class@');
const classStartIndex = util.passCharUntil(contentOrigin, '\n', classStartTagIndex) + 1;

const classContentStart = contentOrigin.indexOf('{', classStartTagIndex);
const classEndIndex = util.getOperateEnd(contentOrigin, classContentStart, '}') + 1;

const classStr = contentOrigin.substring(classStartIndex, classEndIndex);

const mapable = new MapableClass(classStr);

const result=contentOrigin.replace(classStr,mapable.result);

fs.writeFile(filePath, result, function (err) {
    if (err) {
        console.log(err);
    }
});



function MapableClass(origin) {
    this.origin = origin;

    this.tagStart = '//@mapable_generate_code_start';
    this.tagEnd = '//@mapable_generate_code_end';
    this.deleteOld = function () {
        const start = this.origin.indexOf(this.tagStart);
        const end = this.origin.indexOf(this.tagEnd) + 28;
        if (start >= 0 && end >= 0) {
            this.oldDeleted = this.origin.substring(0, start) + this.origin.substring(end);
        } else {
            this.oldDeleted = this.origin;
        }
    };
    this.deleteOld();

    this.className = '';
    this.getClassName = function () {
        const findStart = this.origin.indexOf('class') + 5;
        const start = util.passChar(this.origin, ' ', findStart);
        const end = util.passCharUntil(this.origin, ' ', start);
        this.className = this.origin.substring(start, end);
    };
    this.getClassName();

    this.needMapLine = [];
    this.getNeedMapLine = function () {
        const lines = this.oldDeleted.split('\n');
        for (var i=0;i<lines.length;i++) {
            const line=lines[i];
            if (line.indexOf('@mapable@') >= 0) {
                this.needMapLine.push(line);
            }
        }
    };
    this.getNeedMapLine();

    this.getPropNameFromLine = function (line) {
        if (line.length < 5) return null;

        const equalIndex = line.indexOf('=');

        if (equalIndex < 0) {
            const lineEnd = line.lastIndexOf(';', line.indexOf('//'));
            const propLastIndex = util.lastPassChar(line, ' ', lineEnd - 1);
            const propStartIndex = util.lastPassCharUntil(line, ' ', propLastIndex) + 1;
            if (propStartIndex <= propLastIndex && propStartIndex > 0) {
                return line.substring(propStartIndex, propLastIndex + 1);
            }
        } else {
            const lineEnd = line.lastIndexOf('=', line.indexOf('//'));
            const propLastIndex = util.lastPassChar(line, ' ', lineEnd - 1);
            const propStartIndex = util.lastPassCharUntil(line, ' ', propLastIndex) + 1;
            if (propStartIndex <= propLastIndex && propStartIndex > 0) {
                return line.substring(propStartIndex, propLastIndex + 1);
            }
        }
    };

    this.allPropName = [];
    this.getAllPropName = function () {
        for (var i=0;i<this.needMapLine.length;i++) {
            const needMapLine=this.needMapLine[i];
            const name = this.getPropNameFromLine(needMapLine);
            if (name) {
                this.allPropName.push(name);
            }
        }
    };
    this.getAllPropName();


    const headTomap = '\n  Map<String,dynamic> toMap(){\n    final Map<String,dynamic> map={\n';
    const tailTomap = '    };\n    return map;\n  }'
    this.tomapStr = '';
    this.generateTomapStr = function () {
        this.tomapStr += headTomap;
        for (var i=0;i<this.allPropName.length;i++) {
            const name=this.allPropName[i];
            this.tomapStr += '      "' + name + '":' + name + ',\n';
        }
        this.tomapStr += tailTomap;
    }
    this.generateTomapStr();

    const headFrommap = '\n  ' + this.className + '.fromMap(Map<String,dynamic> map){\n';
    const tailFrommap = '  }\n';
    this.frommapStr = '';
    this.generateFrommapStr = function () {
        this.frommapStr += headFrommap;
        for (var i=0;i<this.allPropName.length;i++) {
            const name=this.allPropName[i];
            this.frommapStr += '      ' + name + '=map["' + name + '"];\n';
        }
        this.frommapStr += tailFrommap;
    }
    this.generateFrommapStr();

    this.allGenerateStr = '';
    this.generateResultStr = function () {
        this.allGenerateStr += this.tagStart + '\n';
        this.allGenerateStr += this.tomapStr;
        this.allGenerateStr += this.frommapStr;
        this.allGenerateStr += this.tagEnd + '\n';

        const resultHead = this.oldDeleted.substring(0, this.oldDeleted.lastIndexOf('}'));
        const resultTail = '}\n';

        this.result = resultHead;
        this.result += this.allGenerateStr;
        this.result += resultTail;
    }
    this.generateResultStr();
}