const fs = require('fs');
const parser = require("@babel/parser"); //PS:transformFromAstAsync


const {
  transformFromAstSync
} = require('@babel/core');

var esm2umd = function (files) {
  delDir("./umd")
  files.forEach((item, index) => {
    const sourceCode = fs.readFileSync(item, {
      encoding: 'utf-8'
    });
    const ast = parser.parse(sourceCode, {
      sourceType: "unambiguous"
    });
    const {
      code
    } = transformFromAstSync(ast, sourceCode, {
      plugins: ["@babel/plugin-transform-modules-umd"]
    }); //win
    let jsc = JSON.stringify(code);
    if(jsc.indexOf("qc-trans")!=-1){
      //console.log("pass-current-file umd");
      //pass
    }else{
      if (item.split("/").length > 0) {
        let list = item.split("/");
        item = list[list.length - 1];
        if (!fs.existsSync("./umd")) {
          fs.mkdirSync("./umd");
        }
        fs.writeFileSync("./umd/" + item, code);
      }
    }

  });
};

var esm2cmj = function (files) {

  delDir("./cmj")
  files.forEach((item, index) => {
    const sourceCode = fs.readFileSync(item, {
      encoding: 'utf-8'
    });
    const ast = parser.parse(sourceCode, {
      sourceType: "unambiguous"
    });
    const {
      code
    } = transformFromAstSync(ast, sourceCode, {
      plugins: ["@babel/plugin-transform-modules-commonjs"]
    });
    let jsc = JSON.stringify(code);
    if(jsc.indexOf("qc-trans")!=-1){
      //pass
      //console.log("pass cmj");
    }else{
      if (item.split("/").length > 0) {
        let list = item.split("/");
        item = list[list.length - 1];
        if (!fs.existsSync("./cmj")) {
          fs.mkdirSync("./cmj");
        }
        fs.writeFileSync("./cmj/" + item, code);
      }
    }
  });
};

function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); 
          } else {
              fs.unlinkSync(curPath); 
          }
      });
      fs.rmdirSync(path);
  }
}
exports.default = {
  esm2umd: esm2umd,
  esm2cmj: esm2cmj
};