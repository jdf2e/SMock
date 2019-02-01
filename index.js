let Core=require('smock-core').Core;
class Smock {
    constructor(options) {
      this.options = options;
    }
    apply(compiler) {
        if(compiler.hooks){
          compiler.hooks.done.tap('Smock', () => {
            new Core(
              this.options
            ); 
          });
        }else{
          compiler.plugin('done',() => {
            new Core(
              this.options
            ); 
          })
        }
    }
  }
module.exports = Smock;